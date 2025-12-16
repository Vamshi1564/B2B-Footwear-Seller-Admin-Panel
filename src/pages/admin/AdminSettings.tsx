import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Bell, 
  Shield, 
  Mail,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettings() {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your platform settings have been updated.",
    });
  };

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-heading font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage platform settings and configurations</p>
        </div>

        {/* General Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-heading flex items-center gap-2">
              <Settings className="w-5 h-5" />
              General Settings
            </CardTitle>
            <CardDescription>Basic platform configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="platformName">Platform Name</Label>
              <Input id="platformName" defaultValue="B2B Footwear Hub" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input id="supportEmail" type="email" defaultValue="support@b2bfootwear.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="supportPhone">Support Phone</Label>
              <Input id="supportPhone" defaultValue="+91 1800 123 4567" />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-heading flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: 'newRetailer', label: 'New Retailer Registration', description: 'Get notified when a new retailer signs up' },
              { id: 'newSeller', label: 'New Seller Registration', description: 'Get notified when a new seller signs up' },
              { id: 'orderAlert', label: 'High Value Orders', description: 'Alert for orders above ₹1,00,000' },
              { id: 'lowCredit', label: 'Credit Limit Alerts', description: 'When retailer credit usage exceeds 80%' },
            ].map((setting) => (
              <div key={setting.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor={setting.id} className="font-medium">{setting.label}</Label>
                  <p className="text-sm text-muted-foreground">{setting.description}</p>
                </div>
                <Switch id={setting.id} defaultChecked />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-heading flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security
            </CardTitle>
            <CardDescription>Security and access control settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="space-y-1">
                <Label className="font-medium">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Require 2FA for all admin accounts</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="space-y-1">
                <Label className="font-medium">Session Timeout</Label>
                <p className="text-sm text-muted-foreground">Auto logout after inactivity</p>
              </div>
              <Input defaultValue="30" className="w-20 text-center" />
              <span className="text-sm text-muted-foreground">minutes</span>
            </div>
          </CardContent>
        </Card>

        {/* Email Templates */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-heading flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Configuration
            </CardTitle>
            <CardDescription>SMTP and email template settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input id="smtpHost" defaultValue="smtp.gmail.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input id="smtpPort" defaultValue="587" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="smtpUser">SMTP Username</Label>
              <Input id="smtpUser" defaultValue="noreply@b2bfootwear.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="smtpPass">SMTP Password</Label>
              <Input id="smtpPass" type="password" defaultValue="••••••••" />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="gradient-primary px-8">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
