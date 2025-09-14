'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StepProps } from '@/lib/types/wizard';
import { DifficultyLevel } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import MultiSelect from '@/components/ui/MultiSelect';
import { 
  FileText,
  Star,
  Users,
  Clock,
  Target,
  Zap,
  Heart,
  Sparkles,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPackageTypeInfo } from '@/lib/packageTypeInfo';

const difficultyOptions = [
  { 
    value: DifficultyLevel.EASY, 
    label: 'Easy', 
    description: 'Suitable for all ages',
    icon: '🟢',
    details: 'Minimal physical activity, accessible to everyone',
    color: 'from-green-500 to-emerald-500'
  },
  { 
    value: DifficultyLevel.MODERATE, 
    label: 'Moderate', 
    description: 'Some physical activity',
    icon: '🟡',
    details: 'Walking, light hiking, or moderate physical exertion',
    color: 'from-yellow-500 to-orange-500'
  },
  { 
    value: DifficultyLevel.CHALLENGING, 
    label: 'Challenging', 
    description: 'Good fitness recommended',
    icon: '🟠',
    details: 'Hiking, climbing, or sustained physical activity',
    color: 'from-orange-500 to-red-500'
  },
  { 
    value: DifficultyLevel.EXPERT, 
    label: 'Expert', 
    description: 'High fitness required',
    icon: '🔴',
    details: 'Advanced hiking, mountaineering, or extreme activities',
    color: 'from-red-500 to-pink-500'
  }
];

const packageCategories = [
  { value: 'adventure', label: 'Adventure', icon: '🏔️', description: 'Thrilling outdoor activities' },
  { value: 'cultural', label: 'Cultural', icon: '🏛️', description: 'Historical sites and museums' },
  { value: 'luxury', label: 'Luxury', icon: '💎', description: 'High-end accommodations' },
  { value: 'nature', label: 'Nature', icon: '🌿', description: 'Wildlife and national parks' },
  { value: 'beach', label: 'Beach', icon: '🏖️', description: 'Coastal destinations' },
  { value: 'city', label: 'City', icon: '🏙️', description: 'Urban exploration' },
  { value: 'wellness', label: 'Wellness', icon: '🧘', description: 'Spa and health-focused' },
  { value: 'food', label: 'Food & Wine', icon: '🍷', description: 'Culinary experiences' },
  { value: 'photography', label: 'Photography', icon: '📸', description: 'Photo tours' },
  { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦', description: 'Family-friendly activities' }
];

const popularTags = [
  'adventure', 'culture', 'beach', 'mountains', 'city', 'nature',
  'wildlife', 'history', 'food', 'photography', 'wellness', 'luxury',
  'budget', 'family', 'romantic', 'solo', 'group', 'hiking', 'diving',
  'safari', 'cruise', 'backpacking', 'spiritual', 'art', 'music'
];

export default function ModernBasicInfoStep({ 
  formData, 
  updateFormData, 
  errors, 
  isValid, 
  onNext,
  onPrevious
}: StepProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(
    formData.difficulty || DifficultyLevel.MODERATE
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    formData.categories || []
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    formData.tags || []
  );

  const handleDifficultySelect = (difficulty: DifficultyLevel) => {
    setSelectedDifficulty(difficulty);
    updateFormData({ difficulty });
  };

  const handleCategorySelect = (categories: string[]) => {
    setSelectedCategories(categories);
    updateFormData({ categories });
  };

  const handleTagSelect = (tags: string[]) => {
    setSelectedTags(tags);
    updateFormData({ tags });
  };

  const handleNext = () => {
    console.log('🔘 Continue to Destinations button clicked');
    console.log('🔍 isValid:', isValid);
    console.log('🔍 formData:', formData);
    console.log('🔍 errors:', errors);
    
    if (isValid) {
      console.log('✅ Validation passed, calling onNext');
      onNext();
    } else {
      console.log('❌ Validation failed, not proceeding');
    }
  };

  // Get package type specific information
  const packageTypeInfo = formData.type ? getPackageTypeInfo(formData.type) : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Tell us about your package
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Share the details that will help travelers understand and get excited about your experience.
        </p>
      </motion.div>

      {/* Package Type Specific Guidance */}
      {packageTypeInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6"
        >
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Creating a {packageTypeInfo.title} Package
              </h3>
              <p className="text-gray-600 mb-4">
                {packageTypeInfo.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Target className="w-4 h-4 mr-2 text-blue-500" />
                    Key Considerations
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {packageTypeInfo.tips.slice(0, 3).map((tip, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Star className="w-4 h-4 mr-2 text-purple-500" />
                    Popular Examples
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {packageTypeInfo.examples.slice(0, 3).map((example, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Basic Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
      >
        <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <Star className="w-6 h-6 mr-3 text-yellow-500" />
          Basic Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Package Name */}
          <div className="md:col-span-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
              Package Name *
            </Label>
            <Input
              id="name"
              value={formData.title || ''}
              onChange={(e) => updateFormData({ title: e.target.value })}
              placeholder="e.g., Amazing Bali Adventure"
              className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.title && (
              <div className="flex items-center mt-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.title[0]}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => updateFormData({ description: e.target.value })}
              placeholder="Describe what makes your package special and what travelers can expect..."
              rows={4}
              className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.description && (
              <div className="flex items-center mt-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.description[0]}
              </div>
            )}
          </div>

          {/* Duration */}
          <div>
            <Label htmlFor="duration" className="text-sm font-medium text-gray-700 mb-2 block">
              Duration (days) *
            </Label>
            <Input
              id="duration"
              type="number"
              min="1"
              value={formData.duration?.days || ''}
              onChange={(e) => {
                const days = parseInt(e.target.value) || 0;
                const nights = Math.max(0, days - 1); // Default nights = days - 1
                updateFormData({ 
                  duration: { 
                    days, 
                    nights 
                  } 
                });
              }}
              placeholder="e.g., 7"
              className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.duration && (
              <div className="flex items-center mt-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.duration[0]}
              </div>
            )}
          </div>

          {/* Group Size */}
          <div>
            <Label htmlFor="maxGroupSize" className="text-sm font-medium text-gray-700 mb-2 block">
              Maximum Group Size *
            </Label>
            <Input
              id="maxGroupSize"
              type="number"
              min="1"
              value={formData.groupSize?.max || ''}
              onChange={(e) => {
                const max = parseInt(e.target.value) || 0;
                const min = formData.groupSize?.min || 1;
                const ideal = formData.groupSize?.ideal || Math.ceil(max / 2);
                updateFormData({ 
                  groupSize: { 
                    min: Math.min(min, max), // Ensure min doesn't exceed max
                    max, 
                    ideal: Math.min(ideal, max) // Ensure ideal doesn't exceed max
                  } 
                });
              }}
              placeholder="e.g., 12"
              className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.groupSize && (
              <div className="flex items-center mt-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.groupSize[0]}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Difficulty Level */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
      >
        <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <Target className="w-6 h-6 mr-3 text-blue-500" />
          Difficulty Level
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {difficultyOptions.map((option) => {
            const isSelected = selectedDifficulty === option.value;
            
            return (
              <motion.div
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={cn(
                    'cursor-pointer transition-all duration-300 border-2',
                    isSelected 
                      ? 'border-blue-500 bg-blue-50 shadow-lg' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  )}
                  onClick={() => handleDifficultySelect(option.value)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">{option.icon}</div>
                    <h4 className={cn(
                      'font-semibold text-lg mb-2',
                      isSelected ? 'text-blue-900' : 'text-gray-900'
                    )}>
                      {option.label}
                    </h4>
                    <p className={cn(
                      'text-sm mb-3',
                      isSelected ? 'text-blue-700' : 'text-gray-600'
                    )}>
                      {option.description}
                    </p>
                    <p className={cn(
                      'text-xs',
                      isSelected ? 'text-blue-600' : 'text-gray-500'
                    )}>
                      {option.details}
                    </p>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mt-3"
                      >
                        <CheckCircle className="w-5 h-5 text-blue-600 mx-auto" />
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
      >
        <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <Heart className="w-6 h-6 mr-3 text-red-500" />
          Categories
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {packageCategories.map((category) => {
            const isSelected = selectedCategories.includes(category.value);
            
            return (
              <motion.div
                key={category.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card
                  className={cn(
                    'cursor-pointer transition-all duration-300 border-2',
                    isSelected 
                      ? 'border-purple-500 bg-purple-50 shadow-lg' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  )}
                  onClick={() => {
                    const newCategories = isSelected
                      ? selectedCategories.filter(c => c !== category.value)
                      : [...selectedCategories, category.value];
                    handleCategorySelect(newCategories);
                  }}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <h4 className={cn(
                      'font-medium text-sm',
                      isSelected ? 'text-purple-900' : 'text-gray-900'
                    )}>
                      {category.label}
                    </h4>
                    <p className={cn(
                      'text-xs mt-1',
                      isSelected ? 'text-purple-700' : 'text-gray-600'
                    )}>
                      {category.description}
                    </p>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mt-2"
                      >
                        <CheckCircle className="w-4 h-4 text-purple-600 mx-auto" />
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Tags */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
      >
        <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <Zap className="w-6 h-6 mr-3 text-yellow-500" />
          Tags
        </h3>
        
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            
            return (
              <motion.div
                key={tag}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    'cursor-pointer transition-all duration-300 px-4 py-2 text-sm',
                    isSelected 
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0' 
                      : 'bg-white border-gray-300 text-gray-700 hover:border-yellow-400'
                  )}
                  onClick={() => {
                    const newTags = isSelected
                      ? selectedTags.filter(t => t !== tag)
                      : [...selectedTags, tag];
                    handleTagSelect(newTags);
                  }}
                >
                  {tag}
                </Badge>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        className="flex justify-between pt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Button
          onClick={onPrevious}
          variant="outline"
          size="lg"
          className="rounded-xl px-8 py-3"
        >
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!isValid}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
          <TrendingUp className="w-5 h-5 mr-2" />
          Continue to Destinations
        </Button>
      </motion.div>
    </div>
  );
}
