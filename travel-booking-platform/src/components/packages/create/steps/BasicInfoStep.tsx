'use client';

import { useState, useEffect } from 'react';
import { StepProps } from '@/lib/types/wizard';
import { DifficultyLevel } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MultiSelect from '@/components/ui/MultiSelect';
import { 
  X, 
  Plus, 
  Calendar, 
  Users, 
  Star, 
  MapPin, 
  Tag,
  Type,
  FileText,
  Clock,
  Target,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const difficultyOptions = [
  { 
    value: DifficultyLevel.EASY, 
    label: 'Easy', 
    description: 'Suitable for all ages and fitness levels',
    icon: '🟢',
    details: 'Minimal physical activity, accessible to everyone'
  },
  { 
    value: DifficultyLevel.MODERATE, 
    label: 'Moderate', 
    description: 'Some physical activity required',
    icon: '🟡',
    details: 'Walking, light hiking, or moderate physical exertion'
  },
  { 
    value: DifficultyLevel.CHALLENGING, 
    label: 'Challenging', 
    description: 'Good fitness level recommended',
    icon: '🟠',
    details: 'Hiking, climbing, or sustained physical activity'
  },
  { 
    value: DifficultyLevel.EXPERT, 
    label: 'Expert', 
    description: 'High fitness level and experience required',
    icon: '🔴',
    details: 'Advanced hiking, mountaineering, or extreme activities'
  }
];

const packageCategories = [
  { value: 'adventure', label: 'Adventure', description: 'Thrilling outdoor activities and experiences' },
  { value: 'cultural', label: 'Cultural', description: 'Historical sites, museums, and cultural immersion' },
  { value: 'luxury', label: 'Luxury', description: 'High-end accommodations and premium services' },
  { value: 'nature', label: 'Nature', description: 'Wildlife, national parks, and natural landscapes' },
  { value: 'beach', label: 'Beach', description: 'Coastal destinations and water activities' },
  { value: 'city', label: 'City', description: 'Urban exploration and metropolitan experiences' },
  { value: 'wellness', label: 'Wellness', description: 'Spa, yoga, meditation, and health-focused trips' },
  { value: 'food', label: 'Food & Wine', description: 'Culinary experiences and gastronomic tours' },
  { value: 'photography', label: 'Photography', description: 'Photo tours and scenic locations' },
  { value: 'family', label: 'Family', description: 'Family-friendly activities and accommodations' }
];

const popularTags = [
  'adventure', 'culture', 'beach', 'mountains', 'city', 'nature',
  'wildlife', 'history', 'food', 'photography', 'wellness', 'luxury',
  'budget', 'family', 'romantic', 'solo', 'group', 'hiking', 'diving',
  'safari', 'cruise', 'backpacking', 'spiritual', 'art', 'music'
];

const destinationOptions = [
  { value: 'Bali, Indonesia', label: 'Bali, Indonesia', description: 'Tropical paradise with rich culture' },
  { value: 'Thailand', label: 'Thailand', description: 'Land of smiles and beautiful beaches' },
  { value: 'Japan', label: 'Japan', description: 'Ancient traditions meet modern innovation' },
  { value: 'Italy', label: 'Italy', description: 'Art, history, and world-class cuisine' },
  { value: 'France', label: 'France', description: 'Romance, culture, and fine dining' },
  { value: 'Spain', label: 'Spain', description: 'Vibrant culture and stunning architecture' },
  { value: 'Greece', label: 'Greece', description: 'Ancient history and beautiful islands' },
  { value: 'Turkey', label: 'Turkey', description: 'Where East meets West' },
  { value: 'Morocco', label: 'Morocco', description: 'Exotic markets and desert landscapes' },
  { value: 'India', label: 'India', description: 'Diverse culture and spiritual experiences' },
  { value: 'Nepal', label: 'Nepal', description: 'Himalayan adventures and ancient temples' },
  { value: 'Peru', label: 'Peru', description: 'Machu Picchu and Andean culture' },
  { value: 'Brazil', label: 'Brazil', description: 'Carnival, beaches, and Amazon rainforest' },
  { value: 'Mexico', label: 'Mexico', description: 'Ancient civilizations and vibrant culture' },
  { value: 'Costa Rica', label: 'Costa Rica', description: 'Biodiversity and eco-adventures' },
  { value: 'New Zealand', label: 'New Zealand', description: 'Stunning landscapes and adventure sports' },
  { value: 'Australia', label: 'Australia', description: 'Unique wildlife and diverse landscapes' },
  { value: 'South Africa', label: 'South Africa', description: 'Safari adventures and cultural diversity' },
  { value: 'Egypt', label: 'Egypt', description: 'Ancient pyramids and Nile cruises' },
  { value: 'Jordan', label: 'Jordan', description: 'Petra and desert adventures' }
];

export default function BasicInfoStep({ 
  formData, 
  updateFormData, 
  errors, 
  isValid, 
  onNext, 
  onPrevious 
}: StepProps) {
  const [tags, setTags] = useState<string[]>(formData.tags || []);
  const [newTag, setNewTag] = useState('');
  const [showHelp, setShowHelp] = useState<string | null>(null);

  // Update form data when local state changes
  useEffect(() => {
    updateFormData({ tags });
  }, [tags, updateFormData]);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 10) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handlePopularTagClick = (tag: string) => {
    if (!tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag]);
    }
  };

  const handleNext = () => {
    onNext();
  };

  const getCharacterCountColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-gray-500';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Basic Information
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Provide essential details about your package. This information will help customers understand what you're offering.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Package Title */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Type className="w-5 h-5 mr-2" />
                Package Title
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="title" className="text-sm font-medium">
                  Package Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => updateFormData({ title: e.target.value })}
                  placeholder="Enter a compelling package title"
                  className="mt-1"
                  maxLength={100}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">
                    Make it descriptive and appealing to attract customers
                  </p>
                  <span className={cn(
                    'text-xs font-medium',
                    getCharacterCountColor((formData.title || '').length, 100)
                  )}>
                    {(formData.title || '').length}/100
                  </span>
                </div>
                {errors.title && (
                  <p className="text-red-600 text-sm mt-1">{errors.title[0]}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Descriptions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Package Descriptions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Short Description */}
              <div>
                <Label htmlFor="shortDescription" className="text-sm font-medium">
                  Short Description *
                </Label>
                <Textarea
                  id="shortDescription"
                  value={formData.shortDescription || ''}
                  onChange={(e) => updateFormData({ shortDescription: e.target.value })}
                  placeholder="Brief description for listings and cards (2-3 sentences)"
                  rows={3}
                  className="mt-1"
                  maxLength={200}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">
                    This appears in search results and package cards
                  </p>
                  <span className={cn(
                    'text-xs font-medium',
                    getCharacterCountColor((formData.shortDescription || '').length, 200)
                  )}>
                    {(formData.shortDescription || '').length}/200
                  </span>
                </div>
                {errors.shortDescription && (
                  <p className="text-red-600 text-sm mt-1">{errors.shortDescription[0]}</p>
                )}
              </div>

              {/* Full Description */}
              <div>
                <Label htmlFor="description" className="text-sm font-medium">
                  Full Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => updateFormData({ description: e.target.value })}
                  placeholder="Detailed description of your package including highlights, activities, and what makes it special"
                  rows={6}
                  className="mt-1"
                  maxLength={2000}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">
                    Include key highlights, activities, and unique selling points
                  </p>
                  <span className={cn(
                    'text-xs font-medium',
                    getCharacterCountColor((formData.description || '').length, 2000)
                  )}>
                    {(formData.description || '').length}/2000
                  </span>
                </div>
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1">{errors.description[0]}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Destinations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Destinations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MultiSelect
                options={destinationOptions}
                value={formData.destinations || []}
                onChange={(value) => updateFormData({ destinations: value })}
                placeholder="Select destinations..."
                searchPlaceholder="Search destinations..."
                maxSelections={10}
                label="Destinations *"
                helpText="Select all destinations included in this package"
                error={errors.destinations?.[0]}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Duration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Duration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="days" className="text-sm font-medium">
                    Days *
                  </Label>
                  <Input
                    id="days"
                    type="number"
                    min="1"
                    max="365"
                    value={formData.duration?.days || ''}
                    onChange={(e) => updateFormData({ 
                      duration: { 
                        ...formData.duration, 
                        days: parseInt(e.target.value) || 0 
                      } 
                    })}
                    className="mt-1"
                    placeholder="7"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Total duration in days
                  </p>
                </div>
                <div>
                  <Label htmlFor="nights" className="text-sm font-medium">
                    Nights *
                  </Label>
                  <Input
                    id="nights"
                    type="number"
                    min="0"
                    max="364"
                    value={formData.duration?.nights || ''}
                    onChange={(e) => updateFormData({ 
                      duration: { 
                        ...formData.duration, 
                        nights: parseInt(e.target.value) || 0 
                      } 
                    })}
                    className="mt-1"
                    placeholder="6"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Number of nights
                  </p>
                </div>
              </div>
              {errors.duration && (
                <p className="text-red-600 text-sm">{errors.duration[0]}</p>
              )}
            </CardContent>
          </Card>

          {/* Group Size */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Group Size
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="minGroup" className="text-sm font-medium">
                    Min *
                  </Label>
                  <Input
                    id="minGroup"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.groupSize?.min || ''}
                    onChange={(e) => updateFormData({ 
                      groupSize: { 
                        ...formData.groupSize, 
                        min: parseInt(e.target.value) || 0 
                      } 
                    })}
                    className="mt-1"
                    placeholder="2"
                  />
                </div>
                <div>
                  <Label htmlFor="maxGroup" className="text-sm font-medium">
                    Max *
                  </Label>
                  <Input
                    id="maxGroup"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.groupSize?.max || ''}
                    onChange={(e) => updateFormData({ 
                      groupSize: { 
                        ...formData.groupSize, 
                        max: parseInt(e.target.value) || 0 
                      } 
                    })}
                    className="mt-1"
                    placeholder="12"
                  />
                </div>
                <div>
                  <Label htmlFor="idealGroup" className="text-sm font-medium">
                    Ideal
                  </Label>
                  <Input
                    id="idealGroup"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.groupSize?.ideal || ''}
                    onChange={(e) => updateFormData({ 
                      groupSize: { 
                        ...formData.groupSize, 
                        ideal: parseInt(e.target.value) || 0 
                      } 
                    })}
                    className="mt-1"
                    placeholder="6"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Set the minimum, maximum, and ideal group sizes for your package
              </p>
              {errors.groupSize && (
                <p className="text-red-600 text-sm">{errors.groupSize[0]}</p>
              )}
            </CardContent>
          </Card>

          {/* Difficulty Level */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Difficulty Level
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {difficultyOptions.map((option) => (
                  <div
                    key={option.value}
                    className={cn(
                      'p-3 border rounded-lg cursor-pointer transition-all duration-200',
                      formData.difficulty === option.value
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    )}
                    onClick={() => updateFormData({ difficulty: option.value })}
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-lg mr-2">{option.icon}</span>
                      <span className="font-medium text-sm">{option.label}</span>
                    </div>
                    <p className="text-xs text-gray-600">{option.description}</p>
                  </div>
                ))}
              </div>
              {errors.difficulty && (
                <p className="text-red-600 text-sm">{errors.difficulty[0]}</p>
              )}
            </CardContent>
          </Card>

          {/* Package Category */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                Package Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.category || ''}
                onValueChange={(value) => updateFormData({ category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {packageCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <div>
                        <div className="font-medium">{category.label}</div>
                        <div className="text-sm text-gray-500">{category.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-red-600 text-sm mt-1">{errors.category[0]}</p>
              )}
            </CardContent>
          </Card>

          {/* Featured Package */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Package Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured || false}
                  onChange={(e) => updateFormData({ isFeatured: e.target.checked })}
                  className="rounded border-gray-300 h-4 w-4"
                />
                <div>
                  <Label htmlFor="isFeatured" className="text-sm font-medium">
                    Mark as Featured Package
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Featured packages appear prominently in search results and recommendations
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tags Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Tag className="w-5 h-5 mr-2" />
            Tags
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Tags */}
          {tags.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Selected Tags ({tags.length}/10)</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center space-x-1"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Add New Tag */}
          <div>
            <Label className="text-sm font-medium">Add Tags</Label>
            <div className="flex space-x-2 mt-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Enter a tag"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                disabled={tags.length >= 10}
              />
              <Button 
                onClick={handleAddTag} 
                size="sm"
                disabled={tags.length >= 10 || !newTag.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {tags.length >= 10 && (
              <p className="text-xs text-yellow-600 mt-1">
                Maximum 10 tags reached
              </p>
            )}
          </div>

          {/* Popular Tags */}
          <div>
            <Label className="text-sm font-medium">Popular Tags</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {popularTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className={cn(
                    'cursor-pointer hover:bg-blue-50 hover:text-blue-700',
                    tags.includes(tag) && 'bg-blue-100 text-blue-800',
                    tags.length >= 10 && 'opacity-50 cursor-not-allowed'
                  )}
                  onClick={() => tags.length < 10 && handlePopularTagClick(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between pt-8 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={onPrevious}
          size="lg"
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isValid}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
        >
          Continue to Destinations
        </Button>
      </div>
    </div>
  );
}