'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StepProps } from '@/lib/types/wizard';
import { PackageType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  ArrowLeft,
  Plus,
  X,
  Info,
  Utensils,
  Ticket,
  User,
  Shield,
  CreditCard,
  Plane,
  Car
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Inclusion/Exclusion fields based on package type
const INCLUSION_FIELDS = {
  [PackageType.ACTIVITY]: {
    tourInclusions: true,
    mealInclusions: true,
    entryTickets: true,
    guideServices: true,
    insurance: false,
    tourExclusions: true,
    personalExpenses: true,
    optionalActivities: true,
    visaDocumentation: false
  },
  [PackageType.TRANSFERS]: {
    tourInclusions: true,
    mealInclusions: false,
    entryTickets: false,
    guideServices: false,
    insurance: false,
    tourExclusions: true,
    personalExpenses: true,
    optionalActivities: false,
    visaDocumentation: false
  },
  [PackageType.LAND_PACKAGE]: {
    tourInclusions: true,
    mealInclusions: true,
    entryTickets: true,
    guideServices: true,
    insurance: true,
    tourExclusions: true,
    personalExpenses: true,
    optionalActivities: true,
    visaDocumentation: true
  },
  [PackageType.LAND_PACKAGE_WITH_HOTEL]: {
    tourInclusions: true,
    mealInclusions: true,
    entryTickets: true,
    guideServices: true,
    insurance: true,
    tourExclusions: true,
    personalExpenses: true,
    optionalActivities: true,
    visaDocumentation: true
  },
  [PackageType.FIXED_DEPARTURE_WITH_FLIGHT]: {
    tourInclusions: true,
    mealInclusions: true,
    entryTickets: true,
    guideServices: true,
    insurance: true,
    tourExclusions: true,
    personalExpenses: true,
    optionalActivities: true,
    visaDocumentation: true
  },
  [PackageType.DAY_TOUR]: {
    tourInclusions: true,
    mealInclusions: true,
    entryTickets: true,
    guideServices: true,
    insurance: true,
    tourExclusions: true,
    personalExpenses: true,
    optionalActivities: true,
    visaDocumentation: false
  },
  [PackageType.MULTI_CITY_TOUR]: {
    tourInclusions: true,
    mealInclusions: true,
    entryTickets: true,
    guideServices: true,
    insurance: true,
    tourExclusions: true,
    personalExpenses: true,
    optionalActivities: true,
    visaDocumentation: true
  }
};

export default function ModernInclusionsExclusionsStep({ 
  formData, 
  updateFormData, 
  errors, 
  isValid, 
  onNext,
  onPrevious
}: StepProps) {
  const [localData, setLocalData] = useState({
    tourInclusions: formData.tourInclusions || [],
    mealInclusions: formData.mealInclusions || [],
    entryTickets: formData.entryTickets || [],
    guideServices: formData.guideServices || [],
    insurance: formData.insurance || [],
    tourExclusions: formData.tourExclusions || [],
    personalExpenses: formData.personalExpenses || [],
    optionalActivities: formData.optionalActivities || [],
    visaDocumentation: formData.visaDocumentation || [],
    newTourInclusion: '',
    newMealInclusion: '',
    newEntryTicket: '',
    newGuideService: '',
    newInsurance: '',
    newTourExclusion: '',
    newPersonalExpense: '',
    newOptionalActivity: '',
    newVisaDocumentation: ''
  });

  const packageType = formData.type;
  const visibleFields = packageType ? INCLUSION_FIELDS[packageType] : {};

  useEffect(() => {
    updateFormData(localData);
  }, [localData]);

  const handleInputChange = (field: string, value: any) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const addItem = (listField: string, inputField: string) => {
    const newItem = localData[inputField as keyof typeof localData] as string;
    if (newItem.trim()) {
      setLocalData(prev => ({
        ...prev,
        [listField]: [...(prev[listField as keyof typeof prev] as string[]), newItem.trim()],
        [inputField]: ''
      }));
    }
  };

  const removeItem = (listField: string, index: number) => {
    setLocalData(prev => ({
      ...prev,
      [listField]: (prev[listField as keyof typeof prev] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleNext = () => {
    onNext();
  };

  const handlePrevious = () => {
    onPrevious();
  };

  const renderInclusionList = (
    title: string,
    listField: string,
    inputField: string,
    icon: React.ReactNode,
    placeholder: string,
    color: string
  ) => {
    const items = localData[listField as keyof typeof localData] as string[];
    const newItem = localData[inputField as keyof typeof localData] as string;

    return (
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700 flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </Label>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Badge variant="secondary" className={`flex-1 justify-start ${color}`}>
                <CheckCircle className="w-3 h-3 mr-1" />
                {item}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(listField, index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <div className="flex space-x-2">
            <Input
              value={newItem}
              onChange={(e) => handleInputChange(inputField, e.target.value)}
              placeholder={placeholder}
              className="flex-1"
            />
            <Button onClick={() => addItem(listField, inputField)} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderExclusionList = (
    title: string,
    listField: string,
    inputField: string,
    icon: React.ReactNode,
    placeholder: string,
    color: string
  ) => {
    const items = localData[listField as keyof typeof localData] as string[];
    const newItem = localData[inputField as keyof typeof localData] as string;

    return (
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700 flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </Label>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Badge variant="outline" className={`flex-1 justify-start ${color}`}>
                <XCircle className="w-3 h-3 mr-1" />
                {item}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(listField, index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <div className="flex space-x-2">
            <Input
              value={newItem}
              onChange={(e) => handleInputChange(inputField, e.target.value)}
              placeholder={placeholder}
              className="flex-1"
            />
            <Button onClick={() => addItem(listField, inputField)} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Inclusions & Exclusions
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Clearly define what's included and excluded in your {packageType?.replace(/_/g, ' ').toLowerCase()} package.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inclusions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-green-700">
              <CheckCircle className="w-5 h-5 mr-2" />
              What's Included
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tour Inclusions */}
            {visibleFields.tourInclusions && renderInclusionList(
              "Tour Inclusions *",
              "tourInclusions",
              "newTourInclusion",
              <CheckCircle className="w-4 h-4 text-green-600" />,
              "Add tour inclusion...",
              "bg-green-50 text-green-700 border-green-200"
            )}

            {/* Meal Inclusions */}
            {visibleFields.mealInclusions && renderInclusionList(
              "Meal Inclusions",
              "mealInclusions",
              "newMealInclusion",
              <Utensils className="w-4 h-4 text-orange-600" />,
              "Add meal inclusion...",
              "bg-orange-50 text-orange-700 border-orange-200"
            )}

            {/* Entry Tickets */}
            {visibleFields.entryTickets && renderInclusionList(
              "Entry Tickets",
              "entryTickets",
              "newEntryTicket",
              <Ticket className="w-4 h-4 text-blue-600" />,
              "Add entry ticket...",
              "bg-blue-50 text-blue-700 border-blue-200"
            )}

            {/* Guide Services */}
            {visibleFields.guideServices && renderInclusionList(
              "Guide Services",
              "guideServices",
              "newGuideService",
              <User className="w-4 h-4 text-purple-600" />,
              "Add guide service...",
              "bg-purple-50 text-purple-700 border-purple-200"
            )}

            {/* Insurance */}
            {visibleFields.insurance && renderInclusionList(
              "Insurance",
              "insurance",
              "newInsurance",
              <Shield className="w-4 h-4 text-indigo-600" />,
              "Add insurance coverage...",
              "bg-indigo-50 text-indigo-700 border-indigo-200"
            )}

            {errors.tourInclusions && (
              <p className="text-red-500 text-sm">{errors.tourInclusions[0]}</p>
            )}
          </CardContent>
        </Card>

        {/* Exclusions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-red-700">
              <XCircle className="w-5 h-5 mr-2" />
              What's Excluded
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tour Exclusions */}
            {visibleFields.tourExclusions && renderExclusionList(
              "Tour Exclusions *",
              "tourExclusions",
              "newTourExclusion",
              <XCircle className="w-4 h-4 text-red-600" />,
              "Add tour exclusion...",
              "bg-red-50 text-red-700 border-red-200"
            )}

            {/* Personal Expenses */}
            {visibleFields.personalExpenses && renderExclusionList(
              "Personal Expenses",
              "personalExpenses",
              "newPersonalExpense",
              <CreditCard className="w-4 h-4 text-gray-600" />,
              "Add personal expense...",
              "bg-gray-50 text-gray-700 border-gray-200"
            )}

            {/* Optional Activities */}
            {visibleFields.optionalActivities && renderExclusionList(
              "Optional Activities",
              "optionalActivities",
              "newOptionalActivity",
              <Plus className="w-4 h-4 text-yellow-600" />,
              "Add optional activity...",
              "bg-yellow-50 text-yellow-700 border-yellow-200"
            )}

            {/* Visa Documentation */}
            {visibleFields.visaDocumentation && renderExclusionList(
              "Visa/Documentation",
              "visaDocumentation",
              "newVisaDocumentation",
              <Plane className="w-4 h-4 text-sky-600" />,
              "Add visa requirement...",
              "bg-sky-50 text-sky-700 border-sky-200"
            )}

            {errors.tourExclusions && (
              <p className="text-red-500 text-sm">{errors.tourExclusions[0]}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Package Type Specific Guidance */}
      {packageType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Info className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {packageType.replace(/_/g, ' ')} Package Guidelines
                  </h3>
                  <div className="text-sm text-gray-600 space-y-2">
                    {packageType === PackageType.ACTIVITY && (
                      <>
                        <p>• Include equipment, guide services, and entry fees</p>
                        <p>• Exclude personal expenses and optional activities</p>
                        <p>• Specify meal inclusions if applicable</p>
                      </>
                    )}
                    {packageType === PackageType.TRANSFERS && (
                      <>
                        <p>• Include vehicle, driver, and fuel costs</p>
                        <p>• Exclude meals, tips, and personal expenses</p>
                        <p>• Specify waiting time and luggage allowances</p>
                      </>
                    )}
                    {(packageType === PackageType.LAND_PACKAGE || 
                      packageType === PackageType.LAND_PACKAGE_WITH_HOTEL || 
                      packageType === PackageType.FIXED_DEPARTURE_WITH_FLIGHT ||
                      packageType === PackageType.DAY_TOUR ||
                      packageType === PackageType.MULTI_CITY_TOUR) && (
                      <>
                        <p>• Include all transportation, activities, and meals</p>
                        <p>• Exclude personal expenses, tips, and optional activities</p>
                        <p>• Specify insurance coverage and visa requirements</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Navigation */}
      <motion.div 
        className="flex justify-between pt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Button
          onClick={handlePrevious}
          variant="outline"
          size="lg"
          className="px-8 py-3"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          size="lg"
          className="px-8 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
        >
          Next: Pricing & Policies
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </div>
  );
}
