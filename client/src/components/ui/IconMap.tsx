import type { LucideIcon } from 'lucide-react';
import {
  BookOpen, Video, Brain, Users, Phone, MapPin, Star, CheckCircle, Play,
  Award, Clock, Megaphone, GraduationCap, Heart, X, ArrowRight, ArrowLeft,
  Calendar, User, Search, Loader2, Lock, FileText, Send, MessageCircle,
  Home, Menu, Sun, Moon, Globe, ChevronDown, LogOut, Settings, Bell,
  Bookmark, CreditCard, LayoutDashboard, BarChart3, Plus, Edit, Trash2,
  Eye, Download, Upload, Image, ExternalLink, Mail, Shield, AlertCircle,
  Info, HelpCircle, ChevronLeft, ChevronRight, Filter, Copy, Share2,
  RefreshCw, Zap, Sparkles, Trophy, Medal, Target, Lightbulb,
  Volume2, Pause, RotateCcw, Grid, List, Layers, Code, Terminal,
  Database, Server, Cloud, Wifi, Monitor, Smartphone, Laptop,
  File, FileVideo, FileAudio, FileCode, FileArchive,
  Folder, FolderOpen, Package, Truck, Car, Bus, Train, Plane,
  Rocket, Building, Building2, ShoppingCart, ShoppingBag, Wallet,
  Coins, Receipt, Calculator, DollarSign, CircleDot, School, PenTool, Pencil,
} from 'lucide-react';

export const iconMap: Record<string, LucideIcon> = {
  BookOpen, Video, Brain, Users, Phone, MapPin, Star, CheckCircle, Play,
  Award, Clock, Megaphone, GraduationCap, Heart, X, ArrowRight, ArrowLeft,
  Calendar, User, Search, Loader2, Lock, FileText, Send, MessageCircle,
  Home, Menu, Sun, Moon, Globe, ChevronDown, LogOut, Settings, Bell,
  Bookmark, CreditCard, LayoutDashboard, BarChart3, Plus, Edit, Trash2,
  Eye, Download, Upload, Image, ExternalLink, Mail, Shield, AlertCircle,
  Info, HelpCircle, ChevronLeft, ChevronRight, Filter, Copy, Share2,
  RefreshCw, Zap, Sparkles, Trophy, Medal, Target, Lightbulb,
  Volume2, Pause, RotateCcw, Grid, List, Layers, Code, Terminal,
  Database, Server, Cloud, Wifi, Monitor, Smartphone, Laptop,
  File, FileVideo, FileAudio, FileCode, FileArchive,
  Folder, FolderOpen, Package, Truck, Car, Bus, Train, Plane,
  Rocket, Building, Building2, ShoppingCart, ShoppingBag, Wallet,
  Coins, Receipt, Calculator, DollarSign, CircleDot, School, PenTool, Pencil,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] || HelpCircle;
}
