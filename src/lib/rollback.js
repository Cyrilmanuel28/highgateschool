import { getVersion, listVersions } from './versions.js'
import { recordChange, CHANGE_STATUSES } from './changeTracker.js'

export async function executeRollback({
  entity,
  recordId,
  targetVersionId = null,
  restoreAction, // callback to restore version in DataContext
  actor = { user: 'admin', role: 'admin' }
}) {
  const versions = listVersions(entity, recordId)
  if (!versions || versions.length === 0) {
    return { ok: false, error: `No previous version history found for ${entity}:${recordId}` }
  }

  let versionToRestore = null
  if (targetVersionId) {
    versionToRestore = getVersion(entity, recordId, targetVersionId)
  } else {
    // Pick the most recent version before the latest
    versionToRestore = versions[1] || versions[0]
  }

  if (!versionToRestore || !versionToRestore.snapshot) {
    return { ok: false, error: 'Target version snapshot could not be found or is empty' }
  }

  try {
    const result = await restoreAction(entity, recordId, versionToRestore.id)
    if (!result || result.ok === false) {
      return { ok: false, error: result?.errors?.[0] || 'Rollback action failed to restore record' }
    }

    recordChange({
      entity,
      recordId,
      title: result.record?.title || result.record?.name || entity,
      action: 'rollback',
      newValue: result.record,
      user: actor.user,
      status: CHANGE_STATUSES.ROLLED_BACK,
      note: `Rolled back to version ${versionToRestore.id} from ${versionToRestore.at}`
    })

    return {
      ok: true,
      restoredVersionId: versionToRestore.id,
      restoredAt: versionToRestore.at,
      record: result.record
    }
  } catch (e) {
    return { ok: false, error: `Rollback exception: ${e.message}` }
  }
}
