import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { type User, userSchema } from "@shared/schema";
import { z } from "zod";
import { Search, AlertCircle, Users as UsersIcon, X, Loader2, Mail, Phone, Globe, Building2, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl p-4 md:p-5">
      <div className="text-3xl md:text-4xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm md:text-base text-white/90">{label}</div>
    </div>
  );
}

function UserCard({ user, index }: { user: User; index: number }) {
  const initial = user.name.charAt(0).toUpperCase();
  const avatarColors = [
    "bg-cyan-500",
    "bg-blue-500", 
    "bg-sky-500",
    "bg-teal-500",
    "bg-indigo-500",
    "bg-cyan-600"
  ];
  const avatarColor = avatarColors[index % avatarColors.length];

  return (
    <Card className="overflow-visible hover-elevate active-elevate-2 transition-all duration-200 hover:shadow-xl bg-white">
      <CardContent className="p-5 md:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base md:text-lg text-gray-900 mb-0.5" data-testid={`text-username-${user.id}`}>
              {user.name}
            </h3>
            <p className="text-sm text-gray-500">@{user.username}</p>
          </div>
          <div
            className={`h-12 w-12 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg`}
            data-testid={`avatar-user-${user.id}`}
          >
            {initial}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">Contact Details</h4>
            <div className="space-y-2">
              <a
                href={`mailto:${user.email}`}
                className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-cyan-600 transition-colors group"
                data-testid={`button-copy-email-${user.id}`}
              >
                <Mail className="h-4 w-4 text-cyan-600 flex-shrink-0" />
                <span className="truncate" data-testid={`text-email-${user.id}`}>{user.email}</span>
              </a>

              <a
                href={`tel:${user.phone}`}
                className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-cyan-600 transition-colors group"
                data-testid={`button-copy-phone-${user.id}`}
              >
                <Phone className="h-4 w-4 text-cyan-600 flex-shrink-0" />
                <span className="truncate">{user.phone}</span>
              </a>

              <a
                href={`https://${user.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-cyan-600 transition-colors group"
                data-testid={`link-website-${user.id}`}
              >
                <Globe className="h-4 w-4 text-cyan-600 flex-shrink-0" />
                <span className="truncate">{user.website}</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">Professional Info</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2.5 text-sm text-gray-700">
                <Building2 className="h-4 w-4 text-cyan-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{user.company.name}</div>
                  <div className="text-xs text-gray-500 truncate">{user.company.catchPhrase}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-sm text-gray-700">
                <MapPin className="h-4 w-4 text-cyan-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <div className="text-gray-600">{user.address.street}, {user.address.suite}</div>
                  <div className="text-gray-600">{user.address.city}, {user.address.zipcode}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data: users = [], isLoading, error, refetch } = useQuery<User[]>({
    queryKey: ["/api/users"],
    queryFn: async () => {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }
      const data = await response.json();
      const usersArraySchema = z.array(userSchema);
      return usersArraySchema.parse(data);
    },
  });

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [users, debouncedSearchQuery]);

  const uniqueCities = useMemo(() => {
    return new Set(filteredUsers.map(u => u.address.city)).size;
  }, [filteredUsers]);

  const uniqueCompanies = useMemo(() => {
    return new Set(filteredUsers.map(u => u.company.name)).size;
  }, [filteredUsers]);

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-cyan-500 via-blue-500 to-blue-600 pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 md:pt-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <UsersIcon className="h-7 w-7 md:h-8 md:w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight" data-testid="text-page-title">
                PROFILE PARK
              </h1>
              <p className="text-sm md:text-base text-white/90">Professional Database Management System</p>
            </div>
          </div>

          <p className="text-white/95 text-sm md:text-base mb-6 md:mb-8 max-w-2xl">
            Explore and connect with users from our comprehensive database. Search, filter, and discover detailed profiles with ease.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
            <StatCard value={users.length} label="Total Users" />
            <StatCard value={filteredUsers.length} label="Filtered Results" />
            <StatCard value={uniqueCities} label="Cities" />
            <StatCard value={uniqueCompanies} label="Companies" />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 -mt-8">
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-11 text-base border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
                data-testid="input-search"
                aria-label="Search users by name"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-gray-100 rounded-full p-1"
                  data-testid="button-clear-search"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 rounded-full bg-cyan-500"></div>
              <span className="text-gray-600 font-medium">{filteredUsers.length} users found</span>
            </div>
          </div>
        </div>
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-24 gap-5" data-testid="container-loading">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-cyan-500/20 absolute animate-ping"></div>
                <Loader2 className="h-16 w-16 text-cyan-600 animate-spin relative" />
              </div>
              <p className="text-base font-medium text-gray-600">Loading users...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-24 gap-5" data-testid="container-error">
              <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center shadow-lg">
                <AlertCircle className="h-10 w-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Failed to load users</h2>
              <p className="text-base text-gray-600 text-center max-w-md">
                We encountered an error while fetching the user directory. Please try again.
              </p>
              <Button onClick={() => refetch()} className="mt-2 bg-cyan-600 hover:bg-cyan-700" size="lg" data-testid="button-retry">
                Try Again
              </Button>
            </div>
          )}

          {!isLoading && !error && filteredUsers.length === 0 && searchQuery && (
            <div className="flex flex-col items-center justify-center py-24 gap-5" data-testid="container-no-results">
              <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center shadow-lg">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">No users found</h2>
              <p className="text-base text-gray-600">
                Try adjusting your search query
              </p>
            </div>
          )}

          {!isLoading && !error && filteredUsers.length === 0 && !searchQuery && (
            <div className="flex flex-col items-center justify-center py-24 gap-5">
              <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center shadow-lg">
                <UsersIcon className="h-10 w-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">No users available</h2>
              <p className="text-base text-gray-600">
                The user directory is currently empty
              </p>
            </div>
          )}

          {!isLoading && !error && filteredUsers.length > 0 && (
            <section aria-label="User directory results">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6" data-testid="container-users-grid">
                {filteredUsers.map((user, index) => (
                  <UserCard key={user.id} user={user} index={index} />
                ))}
              </div>
            </section>
          )}
      </main>
    </div>
  );
}
