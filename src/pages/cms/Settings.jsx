import { useState, useEffect } from 'react'
import { KeyRound, Save, RotateCcw } from 'lucide-react'
import { useData } from '../../context/DataContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { PageHeader, Card, Field, TextInput, TextArea, Btn, ConfirmDialog, Toggle } from '../../components/cms/UI.jsx'
import { ImagePicker } from '../../components/cms/ImagePicker.jsx'
import { resetDb } from '../../lib/store.js'

export default function Settings() {
  const { db, saveSingle, getSingle } = useData()
  const { changePassword } = useAuth()
  const { toast } = useToast()
  const [info, setInfo] = useState(() => ({ ...getSingle('schoolInfo') }))
  const [settings, setSettings] = useState(() => ({ ...getSingle('settings') }))
  const [theme, setTheme] = useState(() => ({ ...getSingle('theme') }))
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => {
    const s = getSingle('schoolInfo')
    if (s && Object.keys(s).length > 0) setInfo(s)
  }, [db.schoolInfo])
  useEffect(() => {
    const s = getSingle('settings')
    if (s && Object.keys(s).length > 0) setSettings(s)
  }, [db.settings])
  useEffect(() => {
    const t = getSingle('theme')
    if (t && Object.keys(t).length > 0) setTheme(t)
  }, [db.theme])

  const saveInfo = async () => {
    try {
      await saveSingle('schoolInfo', info)
      toast('School information saved — updated across the whole site')
    } catch (e) {
      toast('Failed to save: ' + e.message, 'error')
    }
  }

  const saveSettings = async () => {
    try {
      await saveSingle('settings', settings)
      toast('Site settings saved')
    } catch (e) {
      toast('Failed to save: ' + e.message, 'error')
    }
  }

  const saveTheme = async () => {
    try {
      await saveSingle('theme', theme)
      toast('Theme settings saved')
    } catch (e) {
      toast('Failed to save: ' + e.message, 'error')
    }
  }

  const doChangePassword = async () => {
    if (!pw.current || !pw.next) {
      toast('Fill in all password fields', 'error')
      return
    }
    if (pw.next.length < 6) {
      toast('New password must be at least 6 characters', 'error')
      return
    }
    if (pw.next !== pw.confirm) {
      toast('New passwords do not match', 'error')
      return
    }
    const res = await changePassword(pw.current, pw.next)
    if (!res.ok) {
      toast(res.error, 'error')
      return
    }
    setPw({ current: '', next: '', confirm: '' })
    toast('Password changed')
  }

  const doReset = () => {
    resetDb()
    sessionStorage.removeItem('aia_session')
    toast('Database reset to factory content — redirecting…', 'info')
    setTimeout(() => window.location.reload(), 1200)
  }

  const social = info.socialLinks || {}

  return (
    <div>
      <PageHeader title="Settings" subtitle="Site-wide configuration stored in the database" />

      <div className="space-y-6">
        <Card title="School Information" subtitle="Shown in the footer, navbar, contact page and SEO defaults" action={<Btn variant="gold" onClick={saveInfo}><Save size={14} /> Save</Btn>}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="School name">
              <TextInput value={info.name || ''} onChange={(e) => setInfo({ ...info, name: e.target.value })} />
            </Field>
            <Field label="Short name">
              <TextInput value={info.shortName || ''} onChange={(e) => setInfo({ ...info, shortName: e.target.value })} />
            </Field>
            <Field label="Tagline">
              <TextInput value={info.tagline || ''} onChange={(e) => setInfo({ ...info, tagline: e.target.value })} />
            </Field>
            <Field label="Founded">
              <TextInput type="number" value={info.founded || ''} onChange={(e) => setInfo({ ...info, founded: Number(e.target.value) })} />
            </Field>
            <Field label="Address" className="sm:col-span-2">
              <TextArea rows={2} value={info.address || ''} onChange={(e) => setInfo({ ...info, address: e.target.value })} />
            </Field>
            <Field label="Phone">
              <TextInput value={info.phone || ''} onChange={(e) => setInfo({ ...info, phone: e.target.value })} />
            </Field>
            <Field label="Email">
              <TextInput value={info.email || ''} onChange={(e) => setInfo({ ...info, email: e.target.value })} />
            </Field>
            <Field label="Footer text" className="sm:col-span-2">
              <TextArea rows={2} value={info.footerText || ''} onChange={(e) => setInfo({ ...info, footerText: e.target.value })} />
            </Field>
            <Field label="Logo">
              <ImagePicker value={info.logo} onChange={(v) => setInfo({ ...info, logo: v })} />
            </Field>
            <Field label="Copyright text" className="sm:col-span-2">
              <TextInput value={info.copyrightText || ''} onChange={(e) => setInfo({ ...info, copyrightText: e.target.value })} placeholder="e.g. All rights reserved. Founded 1998." />
            </Field>
            <Field label="Office hours">
              <TextInput value={info.officeHours || ''} onChange={(e) => setInfo({ ...info, officeHours: e.target.value })} placeholder="Monday–Friday, 7:30–17:30" />
            </Field>
            <Field label="Saturday hours">
              <TextInput value={info.saturdayHours || ''} onChange={(e) => setInfo({ ...info, saturdayHours: e.target.value })} placeholder="Saturdays during term, 9:00–13:00" />
            </Field>
            <Field label="Map embed URL" className="sm:col-span-2">
              <TextInput value={info.mapEmbedUrl || ''} onChange={(e) => setInfo({ ...info, mapEmbedUrl: e.target.value })} placeholder="OpenStreetMap embed URL" />
            </Field>
            <Field label="Default SEO description" className="sm:col-span-2">
              <TextArea rows={2} value={info.seoDescription || ''} onChange={(e) => setInfo({ ...info, seoDescription: e.target.value })} placeholder="Default meta description for the site" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Facebook">
                <TextInput value={social.facebook || ''} onChange={(e) => setInfo({ ...info, socialLinks: { ...social, facebook: e.target.value } })} />
              </Field>
              <Field label="Instagram">
                <TextInput value={social.instagram || ''} onChange={(e) => setInfo({ ...info, socialLinks: { ...social, instagram: e.target.value } })} />
              </Field>
              <Field label="X / Twitter">
                <TextInput value={social.twitter || ''} onChange={(e) => setInfo({ ...info, socialLinks: { ...social, twitter: e.target.value } })} />
              </Field>
              <Field label="LinkedIn">
                <TextInput value={social.linkedin || ''} onChange={(e) => setInfo({ ...info, socialLinks: { ...social, linkedin: e.target.value } })} />
              </Field>
              <Field label="YouTube">
                <TextInput value={social.youtube || ''} onChange={(e) => setInfo({ ...info, socialLinks: { ...social, youtube: e.target.value } })} />
              </Field>
            </div>
          </div>
        </Card>

        <Card title="Newsletter (Footer)" subtitle="Newsletter section in the footer" action={<Btn variant="gold" onClick={saveInfo}><Save size={14} /> Save</Btn>}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Newsletter title">
              <TextInput value={info.newsletterTitle || ''} onChange={(e) => setInfo({ ...info, newsletterTitle: e.target.value })} placeholder="The Highgate Newsletter" />
            </Field>
            <Field label="Newsletter description">
              <TextInput value={info.newsletterDescription || ''} onChange={(e) => setInfo({ ...info, newsletterDescription: e.target.value })} placeholder="Termly highlights, open days, and community stories" />
            </Field>
            <Field label="Email placeholder">
              <TextInput value={info.newsletterPlaceholder || ''} onChange={(e) => setInfo({ ...info, newsletterPlaceholder: e.target.value })} placeholder="Enter your email" />
            </Field>
            <Field label="Footer sections">
              <div className="grid grid-cols-3 gap-2">
                <TextInput value={info.footerQuickLinksTitle || ''} onChange={(e) => setInfo({ ...info, footerQuickLinksTitle: e.target.value })} placeholder="Quick Links" />
                <TextInput value={info.footerProgrammesTitle || ''} onChange={(e) => setInfo({ ...info, footerProgrammesTitle: e.target.value })} placeholder="Programmes" />
                <TextInput value={info.footerContactTitle || ''} onChange={(e) => setInfo({ ...info, footerContactTitle: e.target.value })} placeholder="Contact" />
              </div>
            </Field>
          </div>
        </Card>

        <Card title="Contact Page" subtitle="Text on the contact page" action={<Btn variant="gold" onClick={saveInfo}><Save size={14} /> Save</Btn>}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Page heading">
              <TextInput value={info.contactHeading || ''} onChange={(e) => setInfo({ ...info, contactHeading: e.target.value })} placeholder="Contact Us" />
            </Field>
            <Field label="Eyebrow">
              <TextInput value={info.contactEyebrow || ''} onChange={(e) => setInfo({ ...info, contactEyebrow: e.target.value })} placeholder="Get in Touch" />
            </Field>
            <Field label="Subheading" className="sm:col-span-2">
              <TextArea rows={2} value={info.contactSubheading || ''} onChange={(e) => setInfo({ ...info, contactSubheading: e.target.value })} placeholder="Questions about admissions, tours, or anything else" />
            </Field>
            <Field label="Reach us heading">
              <TextInput value={info.contactReachUsHeading || ''} onChange={(e) => setInfo({ ...info, contactReachUsHeading: e.target.value })} placeholder="Reach Us Directly" />
            </Field>
            <Field label="Office hours label">
              <TextInput value={info.contactOfficeHoursLabel || ''} onChange={(e) => setInfo({ ...info, contactOfficeHoursLabel: e.target.value })} placeholder="Office Hours" />
            </Field>
            <Field label="Form heading">
              <TextInput value={info.contactFormHeading || ''} onChange={(e) => setInfo({ ...info, contactFormHeading: e.target.value })} placeholder="Send a Message" />
            </Field>
            <Field label="Form subheading">
              <TextInput value={info.contactFormSubheading || ''} onChange={(e) => setInfo({ ...info, contactFormSubheading: e.target.value })} placeholder="For admissions enquiries..." />
            </Field>
            <Field label="Success heading">
              <TextInput value={info.contactSuccessHeading || ''} onChange={(e) => setInfo({ ...info, contactSuccessHeading: e.target.value })} placeholder="Message Sent" />
            </Field>
            <Field label="Success message">
              <TextInput value={info.contactSuccessMessage || ''} onChange={(e) => setInfo({ ...info, contactSuccessMessage: e.target.value })} placeholder="Thank you, we will reply within one working day." />
            </Field>
          </div>
        </Card>

        <Card title="Fees Page" subtitle="Text on the fees page" action={<Btn variant="gold" onClick={saveInfo}><Save size={14} /> Save</Btn>}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Page heading">
              <TextInput value={info.feesHeading || ''} onChange={(e) => setInfo({ ...info, feesHeading: e.target.value })} placeholder="School Fees" />
            </Field>
            <Field label="Eyebrow">
              <TextInput value={info.feesEyebrow || ''} onChange={(e) => setInfo({ ...info, feesEyebrow: e.target.value })} placeholder="Fees & Finance" />
            </Field>
            <Field label="Subheading" className="sm:col-span-2">
              <TextArea rows={2} value={info.feesSubheading || ''} onChange={(e) => setInfo({ ...info, feesSubheading: e.target.value })} placeholder="Transparent, termly fees..." />
            </Field>
            <Field label="Payment & bursaries title">
              <TextInput value={info.paymentBursariesTitle || ''} onChange={(e) => setInfo({ ...info, paymentBursariesTitle: e.target.value })} placeholder="Payment & Bursaries" />
            </Field>
            <Field label="Payment & bursaries text" className="sm:col-span-2">
              <TextArea rows={2} value={info.paymentBursariesText || ''} onChange={(e) => setInfo({ ...info, paymentBursariesText: e.target.value })} placeholder="Fees are payable termly in advance..." />
            </Field>
            <Field label="Ways to pay title">
              <TextInput value={info.paymentMethodsTitle || ''} onChange={(e) => setInfo({ ...info, paymentMethodsTitle: e.target.value })} placeholder="Ways to Pay" />
            </Field>
            <Field label="Ways to pay text" className="sm:col-span-2">
              <TextArea rows={2} value={info.paymentMethodsText || ''} onChange={(e) => setInfo({ ...info, paymentMethodsText: e.target.value })} placeholder="Fees are payable termly in advance..." />
            </Field>
          </div>
        </Card>

        <Card title="Assistant Widget" subtitle="AI assistant widget text" action={<Btn variant="gold" onClick={saveInfo}><Save size={14} /> Save</Btn>}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Widget title">
              <TextInput value={info.assistantTitle || ''} onChange={(e) => setInfo({ ...info, assistantTitle: e.target.value })} placeholder="Assistant" />
            </Field>
            <Field label="Status text">
              <TextInput value={info.assistantSubtitle || ''} onChange={(e) => setInfo({ ...info, assistantSubtitle: e.target.value })} placeholder="Online — answers instantly" />
            </Field>
            <Field label="Welcome message" className="sm:col-span-2">
              <TextInput value={info.assistantWelcome || ''} onChange={(e) => setInfo({ ...info, assistantWelcome: e.target.value })} placeholder="Hi, I'm the Assistant" />
            </Field>
            <Field label="Welcome description" className="sm:col-span-2">
              <TextArea rows={2} value={info.assistantWelcomeText || ''} onChange={(e) => setInfo({ ...info, assistantWelcomeText: e.target.value })} placeholder="I can help you with admissions, fees, programmes..." />
            </Field>
            <Field label="Button label">
              <TextInput value={info.assistantButtonLabel || ''} onChange={(e) => setInfo({ ...info, assistantButtonLabel: e.target.value })} placeholder="Ask Assistant" />
            </Field>
            <Field label="Suggestions label">
              <TextInput value={info.assistantSuggestionsLabel || ''} onChange={(e) => setInfo({ ...info, assistantSuggestionsLabel: e.target.value })} placeholder="Try asking" />
            </Field>
            <Field label="Input placeholder">
              <TextInput value={info.assistantPlaceholder || ''} onChange={(e) => setInfo({ ...info, assistantPlaceholder: e.target.value })} placeholder="Ask me anything..." />
            </Field>
            <Field label="Clear button label">
              <TextInput value={info.assistantClearLabel || ''} onChange={(e) => setInfo({ ...info, assistantClearLabel: e.target.value })} placeholder="Clear conversation" />
            </Field>
          </div>
        </Card>

        <Card title="Site Settings" subtitle="Admin account and site behaviour" action={<Btn variant="gold" onClick={saveSettings}><Save size={14} /> Save</Btn>}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Admin username" hint="Used to sign in to this dashboard">
              <TextInput value={settings.adminUser || ''} onChange={(e) => setSettings({ ...settings, adminUser: e.target.value })} />
            </Field>
            <Field label="Contact email">
              <TextInput value={settings.contactEmail || ''} onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })} />
            </Field>
            <Field label="Default Open Graph image" className="sm:col-span-2">
              <ImagePicker value={settings.defaultOgImage} onChange={(v) => setSettings({ ...settings, defaultOgImage: v })} />
            </Field>
            <Field label="Analytics ID" hint="Optional — e.g. G-XXXXXXX">
              <TextInput value={settings.analyticsId || ''} onChange={(e) => setSettings({ ...settings, analyticsId: e.target.value })} />
            </Field>
            <div className="flex items-end pb-2">
              <Toggle checked={!settings.maintenance} onChange={(v) => setSettings({ ...settings, maintenance: !v })} label="Website online" />
            </div>
          </div>
        </Card>

        <Card title="Theme" subtitle="Brand colours used across the public site" action={<Btn variant="gold" onClick={saveTheme}><Save size={14} /> Save</Btn>}>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { key: 'primaryColor', label: 'Primary colour (navy)' },
              { key: 'accentColor', label: 'Accent colour (gold)' },
              { key: 'backgroundColor', label: 'Background colour' }
            ].map((f) => (
              <Field key={f.key} label={f.label}>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme[f.key] || '#1B2A4A'}
                    onChange={(e) => setTheme({ ...theme, [f.key]: e.target.value })}
                    className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
                  />
                  <TextInput value={theme[f.key] || ''} onChange={(e) => setTheme({ ...theme, [f.key]: e.target.value })} />
                </div>
              </Field>
            ))}
          </div>
        </Card>

        <Card title="Change Password" action={<Btn variant="outline" onClick={doChangePassword}><KeyRound size={14} /> Update Password</Btn>}>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Current password">
              <TextInput type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} />
            </Field>
            <Field label="New password">
              <TextInput type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
            </Field>
            <Field label="Confirm new password">
              <TextInput type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
            </Field>
          </div>
        </Card>

        <Card title="Danger Zone" subtitle="Factory reset — restores the original demo content" className="border-red-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-xl text-sm text-slate-600">
              Reset the entire database (all content, media, and settings) back to the factory seed data. This cannot be undone.
            </p>
            <Btn variant="danger" onClick={() => setConfirmReset(true)}>
              <RotateCcw size={14} /> Reset Database
            </Btn>
          </div>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmReset}
        title="Reset the entire database?"
        message="All pages, news, events, media, settings and messages will be replaced with the original factory content. This is permanent."
        onCancel={() => setConfirmReset(false)}
        onConfirm={doReset}
        confirmLabel="Reset Everything"
      />
    </div>
  )
}
