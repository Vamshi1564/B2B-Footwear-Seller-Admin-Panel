import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Camera,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SellerSettings() {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your business profile has been saved successfully.",
    });
  };

  return (
    <DashboardLayout userType="seller">
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-heading font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your business profile and account settings</p>
        </div>

        {/* Business Profile */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-heading flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Business Profile
            </CardTitle>
            <CardDescription>Update your business information visible to retailers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo Upload */}
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                  PF
                </AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm">
                  <Camera className="w-4 h-4 mr-2" />
                  Change Logo
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Recommended: 200x200px, PNG or JPG
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" defaultValue="Premier Footwear Co." />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Business Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Tell retailers about your business..."
                  defaultValue="Leading wholesaler of premium footwear since 2010. Specializing in formal, casual, and sports shoes."
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="gst">GST Number</Label>
                  <Input id="gst" defaultValue="29ABCDE1234F1Z5" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pan">PAN Number</Label>
                  <Input id="pan" defaultValue="ABCDE1234F" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-heading flex items-center gap-2">
              <User className="w-5 h-5" />
              Contact Information
            </CardTitle>
            <CardDescription>Your contact details for business communication</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="ownerName">Owner Name</Label>
                <Input id="ownerName" defaultValue="Vikram Singh" />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </Label>
                  <Input id="email" type="email" defaultValue="vikram@premierfootwear.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </Label>
                  <Input id="phone" defaultValue="+91 99887 76655" />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Business Address
                </Label>
                <Textarea 
                  id="address" 
                  defaultValue="123, Industrial Area Phase 2, Sector 17, Gurugram, Haryana - 122001"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bank Details */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-heading">Bank Details</CardTitle>
            <CardDescription>For payment settlements and transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input id="bankName" defaultValue="HDFC Bank" />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input id="accountNumber" defaultValue="XXXX XXXX 4567" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ifsc">IFSC Code</Label>
                  <Input id="ifsc" defaultValue="HDFC0001234" />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="accountHolder">Account Holder Name</Label>
                <Input id="accountHolder" defaultValue="Premier Footwear Co." />
              </div>
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
