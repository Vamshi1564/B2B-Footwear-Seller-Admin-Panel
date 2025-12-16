import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockBanners } from '@/data/mockData';
import { Banner } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Image as ImageIcon, Edit, Trash2, GripVertical, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminBanners() {
  const { toast } = useToast();
  const [banners, setBanners] = useState(mockBanners);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleToggleStatus = (bannerId: string) => {
    setBanners(banners.map(b => 
      b.id === bannerId 
        ? { ...b, status: b.status === 'active' ? 'inactive' : 'active' } as Banner
        : b
    ));
    toast({
      title: "Status Updated",
      description: "Banner visibility has been updated.",
    });
  };

  const handleDelete = (banner: Banner) => {
    setBanners(banners.filter(b => b.id !== banner.id));
    toast({
      title: "Banner Deleted",
      description: `"${banner.title}" has been removed.`,
      variant: "destructive",
    });
  };

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold">Banners</h1>
            <p className="text-muted-foreground">Manage promotional banners for the home screen</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-accent text-accent-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add Banner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="font-heading">Add New Banner</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Banner Title</Label>
                  <Input id="title" placeholder="Enter banner title" />
                </div>
                <div className="grid gap-2">
                  <Label>Banner Image</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <ImageIcon className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended: 1200x400px, PNG or JPG
                    </p>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="link">Link URL (Optional)</Label>
                  <Input id="link" placeholder="https://..." />
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <Label htmlFor="active">Active</Label>
                  <Switch id="active" defaultChecked />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="gradient-primary">Add Banner</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {banners.filter(b => b.status === 'active').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Active Banners</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {banners.filter(b => b.status === 'inactive').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Inactive Banners</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Banners List */}
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Drag to reorder. Banners will appear in this order on the home screen.
          </p>
          
          {banners.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="p-8 text-center">
                <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No banners added yet</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Banner
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {banners.sort((a, b) => a.order - b.order).map((banner) => (
                <Card key={banner.id} className="shadow-card overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex items-center">
                      {/* Drag Handle */}
                      <div className="p-4 cursor-grab hover:bg-muted/50 transition-colors">
                        <GripVertical className="w-5 h-5 text-muted-foreground" />
                      </div>

                      {/* Image Preview */}
                      <div className="w-40 h-24 bg-muted flex-shrink-0 hidden sm:block">
                        <img 
                          src={banner.imageUrl} 
                          alt={banner.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Banner Info */}
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold">{banner.title}</h3>
                            {banner.link && (
                              <a 
                                href={banner.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"
                              >
                                {banner.link}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              Added on {banner.createdAt}
                            </p>
                          </div>
                          <StatusBadge status={banner.status} />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 p-4 border-l border-border">
                        <Switch 
                          checked={banner.status === 'active'}
                          onCheckedChange={() => handleToggleStatus(banner.id)}
                        />
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDelete(banner)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
