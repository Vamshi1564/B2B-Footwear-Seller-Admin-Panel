import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  Truck, 
  MapPin, 
  Percent, 
  Package,
  Plus,
  X,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SellerPricing() {
  const { toast } = useToast();
  const [moq, setMoq] = useState('24');
  const [deliveryCharge, setDeliveryCharge] = useState('500');
  const [freeDeliveryEnabled, setFreeDeliveryEnabled] = useState(true);
  const [pincodes, setPincodes] = useState(['560001', '560002', '560003', '380001', '500001']);
  const [newPincode, setNewPincode] = useState('');

  const addPincode = () => {
    if (newPincode && !pincodes.includes(newPincode)) {
      setPincodes([...pincodes, newPincode]);
      setNewPincode('');
    }
  };

  const removePincode = (pincode: string) => {
    setPincodes(pincodes.filter(p => p !== pincode));
  };

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your pricing and delivery settings have been updated.",
    });
  };

  return (
    <DashboardLayout userType="seller">
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-heading font-bold">Pricing & Delivery</h1>
          <p className="text-muted-foreground">Configure your MOQ, delivery charges, and service areas</p>
        </div>

        {/* MOQ Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-heading">Minimum Order Quantity (MOQ)</CardTitle>
                <CardDescription>Set the minimum order quantity for free delivery</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="moq">MOQ (in pairs)</Label>
              <Input
                id="moq"
                type="number"
                value={moq}
                onChange={(e) => setMoq(e.target.value)}
                className="max-w-xs"
              />
              <p className="text-sm text-muted-foreground">
                Orders below this quantity will incur additional delivery charges.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Truck className="w-5 h-5 text-accent" />
              </div>
              <div>
                <CardTitle className="text-lg font-heading">Delivery Settings</CardTitle>
                <CardDescription>Configure delivery charges and free delivery options</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="space-y-1">
                <Label className="font-medium">Free Delivery on MOQ</Label>
                <p className="text-sm text-muted-foreground">
                  Enable free delivery when order meets MOQ
                </p>
              </div>
              <Switch 
                checked={freeDeliveryEnabled}
                onCheckedChange={setFreeDeliveryEnabled}
              />
            </div>

            <Separator />

            <div className="grid gap-2">
              <Label htmlFor="deliveryCharge">Delivery Charge (₹)</Label>
              <Input
                id="deliveryCharge"
                type="number"
                value={deliveryCharge}
                onChange={(e) => setDeliveryCharge(e.target.value)}
                className="max-w-xs"
              />
              <p className="text-sm text-muted-foreground">
                This charge applies when order quantity is below MOQ.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Service Area */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-success" />
              </div>
              <div>
                <CardTitle className="text-lg font-heading">Service Area</CardTitle>
                <CardDescription>Manage pincodes where your products are available</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter pincode"
                value={newPincode}
                onChange={(e) => setNewPincode(e.target.value)}
                className="max-w-xs"
                onKeyDown={(e) => e.key === 'Enter' && addPincode()}
              />
              <Button onClick={addPincode} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {pincodes.map((pincode) => (
                <Badge 
                  key={pincode} 
                  variant="secondary"
                  className="px-3 py-1.5 text-sm flex items-center gap-2"
                >
                  {pincode}
                  <button 
                    onClick={() => removePincode(pincode)}
                    className="hover:text-destructive transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>

            <p className="text-sm text-muted-foreground">
              Products will only be visible to retailers in these pincodes.
            </p>
          </CardContent>
        </Card>

        {/* Retailer Margins */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <Percent className="w-5 h-5 text-info" />
              </div>
              <div>
                <CardTitle className="text-lg font-heading">Retailer Margins</CardTitle>
                <CardDescription>Set custom pricing margins for specific retailers</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Urban Footwear Hub', margin: 5 },
                { name: 'Comfort Zone Shoes', margin: 3 },
              ].map((retailer) => (
                <div key={retailer.name} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{retailer.name}</p>
                    <p className="text-sm text-muted-foreground">Additional margin applied</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      defaultValue={retailer.margin}
                      className="w-20 text-center"
                    />
                    <span className="text-muted-foreground">%</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Retailer Margin
              </Button>
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
