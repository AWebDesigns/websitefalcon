import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Lock, 
  LogOut, 
  Trash2, 
  Mail, 
  Phone, 
  Globe, 
  Building2,
  MessageCircle,
  Calendar,
  User,
  Briefcase,
  RefreshCw
} from "lucide-react";
import { Toaster, toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Login component
const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${API}/admin/login`, { password });
      if (response.data.success) {
        localStorage.setItem("adminToken", response.data.token);
        onLogin(response.data.token);
        toast.success("Login successful!");
      }
    } catch (error) {
      toast.error("Invalid password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-950">Admin Dashboard</h1>
          <p className="text-slate-600 mt-2">Enter your password to view leads</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              data-testid="admin-password-input"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-slate-950 hover:bg-slate-800"
            disabled={isLoading}
            data-testid="admin-login-btn"
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-slate-500 hover:text-slate-700">
            ← Back to website
          </a>
        </div>
      </div>
    </div>
  );
};

// Lead card component
const LeadCard = ({ lead, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check if lead is less than 1 day old
  const isNew = () => {
    const createdAt = new Date(lead.created_at);
    const now = new Date();
    const oneDayMs = 24 * 60 * 60 * 1000;
    return (now - createdAt) < oneDayMs;
  };

  const getProjectTypeLabel = (type) => {
    if (type === 'new_website') return 'New Website';
    if (type === 'fix_existing') return 'Redesign / Fix';
    return type?.replace('_', ' ');
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    
    setIsDeleting(true);
    try {
      await onDelete(lead.id);
      toast.success("Lead deleted");
    } catch (error) {
      toast.error("Failed to delete lead");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-950">{lead.name}</h3>
            <p className="text-sm text-slate-500">{lead.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isNew() && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              new
            </span>
          )}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
            data-testid={`delete-lead-${lead.id}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-3 text-sm">
        {lead.project_type && (
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-blue-600">{getProjectTypeLabel(lead.project_type)}</span>
          </div>
        )}
        
        {lead.business_name && (
          <div className="flex items-center gap-2 text-slate-600">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span>{lead.business_name}</span>
          </div>
        )}

        {lead.phone && (
          <div className="flex items-center gap-2 text-slate-600">
            <Phone className="w-4 h-4 text-slate-400" />
            <a 
              href={`tel:${lead.phone}`}
              className="hover:text-blue-500"
            >
              {lead.phone}
            </a>
          </div>
        )}
        
        {lead.website_url && (
          <div className="flex items-center gap-2 text-slate-600">
            <Globe className="w-4 h-4 text-slate-400" />
            <a href={lead.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {lead.website_url}
            </a>
          </div>
        )}
        
        {lead.preferred_contact && (
          <div className="flex items-center gap-2 text-slate-600">
            {lead.preferred_contact === 'whatsapp' ? (
              <MessageCircle className="w-4 h-4 text-green-500" />
            ) : (
              <Mail className="w-4 h-4 text-blue-500" />
            )}
            <span>Prefers {lead.preferred_contact}</span>
            {lead.phone && lead.preferred_contact === 'whatsapp' && (
              <a 
                href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-500 hover:underline"
              >
                ({lead.phone})
              </a>
            )}
          </div>
        )}
        
        {lead.message && (
          <div className="mt-3 p-3 bg-slate-50 rounded-lg">
            <p className="text-slate-600 italic">"{lead.message}"</p>
          </div>
        )}
        
        <div className="flex items-center gap-2 text-slate-400 pt-2 border-t border-slate-100 mt-3">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(lead.created_at)}</span>
        </div>
      </div>
    </div>
  );
};

// Dashboard component
const Dashboard = ({ token, onLogout }) => {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API}/leads`, {
        headers: { 'X-Admin-Token': token }
      });
      setLeads(response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        onLogout();
      } else {
        toast.error("Failed to fetch leads");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [token]);

  const handleDelete = async (leadId) => {
    await axios.delete(`${API}/leads/${leadId}`, {
      headers: { 'X-Admin-Token': token }
    });
    setLeads(leads.filter(l => l.id !== leadId));
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    onLogout();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-950 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-950">Admin Dashboard</h1>
              <p className="text-sm text-slate-500">Falcon Web Studio</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLeads}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              data-testid="admin-logout-btn"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Lead Submissions</h2>
            <p className="text-slate-600">{leads.length} total leads</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-950 rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-500 mt-4">Loading leads...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <Mail className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-950">No leads yet</h3>
            <p className="text-slate-500">Leads will appear here when someone submits the demo form</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leads.map(lead => (
              <LeadCard key={lead.id} lead={lead} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

// Main Admin component
function Admin() {
  const [token, setToken] = useState(localStorage.getItem("adminToken"));

  return (
    <>
      <Toaster position="top-center" richColors />
      {token ? (
        <Dashboard token={token} onLogout={() => setToken(null)} />
      ) : (
        <AdminLogin onLogin={setToken} />
      )}
    </>
  );
}

export default Admin;
