import React from 'react';
import { cn } from '@/lib/utils';
import { User, UserRole } from '@/lib/types';

interface UserProfileCardProps {
  user: User;
  className?: string;
  showActions?: boolean;
}

export function UserProfileCard({ user, className, showActions = true }: UserProfileCardProps) {
  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'bg-red-100 text-red-800';
      case UserRole.ADMIN:
        return 'bg-purple-100 text-purple-800';
      case UserRole.TOUR_OPERATOR:
        return 'bg-blue-100 text-blue-800';
      case UserRole.TRAVEL_AGENT:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={cn('card', 'animate-slide-up', className)}>
      <div className="card-header">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            {user.profile.avatar ? (
              <img 
                src={user.profile.avatar} 
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl font-semibold text-gray-600">
                {user.profile.firstName[0]}{user.profile.lastName[0]}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900">
              {user.profile.firstName} {user.profile.lastName}
            </h3>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={cn('px-2 py-1 rounded-md text-xs font-medium', getRoleColor(user.role))}>
                {user.role.replace('_', ' ')}
              </span>
              <span className={cn(
                'px-2 py-1 rounded-md text-xs font-medium',
                user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              )}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card-body">
        <div className="space-y-3">
          {user.profile.phone && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Phone:</span>
              <span className="text-sm font-medium">{user.profile.phone}</span>
            </div>
          )}
          
          {user.profile.bio && (
            <div>
              <span className="text-sm text-gray-500">Bio:</span>
              <p className="text-sm text-gray-700 mt-1">{user.profile.bio}</p>
            </div>
          )}
          
          {user.profile.address && (
            <div>
              <span className="text-sm text-gray-500">Address:</span>
              <p className="text-sm text-gray-700 mt-1">
                {user.profile.address.street}, {user.profile.address.city}, {user.profile.address.state}
              </p>
            </div>
          )}
          
          <div className="flex items-center gap-4 pt-3 border-t border-gray-200">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-500">Joined:</span>
              <span className="text-sm font-medium">
                {user.createdAt.toLocaleDateString()}
              </span>
            </div>
            {user.lastLoginAt && (
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">Last Login:</span>
                <span className="text-sm font-medium">
                  {user.lastLoginAt.toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showActions && (
        <div className="card-footer">
          <div className="flex gap-2">
            <button className="btn btn-secondary btn-sm">
              Edit Profile
            </button>
            <button className="btn btn-primary btn-sm">
              View Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
