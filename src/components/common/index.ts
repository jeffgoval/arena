/**
 * Common Components Barrel Export
 * Centralizes all common/utility component exports
 */

export { EmptyState } from "../EmptyState";
export { ErrorState } from "../ErrorState";
export { ErrorBoundary } from "../ErrorBoundary";
export { 
  Spinner, 
  PageSpinner, 
  ProgressBar, 
  SimpleUploadProgress,
  GameCardSkeleton,
  GameListSkeleton,
  CourtCardSkeleton,
  CourtGridSkeleton
} from "../LoadingStates";
export { SuccessAnimation } from "../SuccessAnimation";
export { OptimizedImage } from "../OptimizedImage";
export { VirtualList } from "../VirtualList";
export { WhatsAppPreview } from "../WhatsAppPreview";
export { 
  SmartEmptyState, 
  CompactEmptyState, 
  InlineEmptyState 
} from "./SmartEmptyState";
export { CommandPalette } from "./CommandPalette";
export { 
  DashboardBuilder, 
  CompactDashboard 
} from "./DashboardBuilder";
export { 
  ProgressiveDisclosure, 
  FAQDisclosure, 
  StepDisclosure 
} from "./ProgressiveDisclosure";
export {
  BookingCardSkeleton,
  BookingListSkeleton,
  BookingWidgetSkeleton,
  CompactBookingSkeleton,
  InvitationCardSkeleton,
  StatsCardSkeleton,
  TransactionRowSkeleton,
  TransactionListSkeleton,
  DashboardStatsGridSkeleton,
  DashboardSkeleton,
  ShimmerWrapper,
} from "./BookingSkeletons";
export {
  BottomSheet,
  BottomSheetForm,
  BottomSheetConfirm,
  BottomSheetSelect,
} from "./BottomSheet";
export {
  MobileOptimizedInput,
  PhoneInput,
  EmailInput,
  CPFInput,
  CurrencyInput,
  SearchInput,
  NumberInput,
  PasswordInput,
  DateInput,
  TimeInput,
} from "./MobileOptimizedInput";
export {
  AnimatedCheckmark,
  CelebrationAnimation,
  SubtleSuccess,
  BadgeEarnedAnimation,
  HeartAnimation,
  SuccessOverlay,
  LoadingToSuccess,
} from "./SuccessAnimations";
export {
  NoBookingsEmpty,
  NoInvitationsEmpty,
  NoTransactionsEmpty,
  NoSearchResultsEmpty,
  NoNotificationsEmpty,
  NoTeamsEmpty,
  ErrorStateWithRetry,
  NetworkErrorState,
  PermissionDeniedState,
  ComingSoonState,
  GenericEmptyState,
} from "./EmptyStatesLibrary";
export {
  OptimizedList,
  OptimizedGrid,
  MemoizedItem,
} from "./OptimizedList";
export {
  LazyComponent,
  createLazyComponent,
  LazyOnInteraction,
  LazyAfterDelay,
  LazyOnIdle,
  LazyWithPriority,
} from "./LazyComponent";
export {
  LinearProgress,
  CircularProgress,
  StepProgress,
  UploadProgress,
  SkeletonPulse,
  IndeterminateProgress,
  MultiStepProgress,
} from "./ProgressIndicators";
export {
  InteractiveButton,
  SuccessButton,
  ProgressButton,
  SlideButton,
  HoldButton,
  ToggleButton,
} from "./ButtonMicrointeractions";
export {
  Skeleton,
  TextSkeleton,
  AvatarSkeleton,
  CardSkeleton,
  TableSkeleton,
  FormSkeleton,
  DashboardStatsSkeleton,
  ListItemSkeleton,
  CalendarSkeleton,
  ChartSkeleton,
  ProfileSkeleton,
  NotificationSkeleton,
  GridSkeleton,
  ContextualLoading,
} from "./AdvancedSkeletons";
export { GlobalSearchBar } from "./GlobalSearchBar";
export {
  SmartFilters,
  BookingFilters,
  TransactionFilters,
} from "./SmartFilters";
export { Kbd } from "./Kbd";
export {
  FormAutoSave,
  AutoSaveStatus,
  DraftList,
  SimpleAutoSaveIndicator,
} from "./FormAutoSave";
export {
  LocalStorageManager,
  StorageQuotaIndicator,
} from "./LocalStorageManager";
export {
  BackButton,
  Breadcrumbs,
  NavigationHistoryDropdown,
  SwipeIndicator,
  SwipePageTransition,
  BottomNavigation,
  FloatingBackButton,
} from "./NavigationComponents";
export {
  ContextualTooltip,
  InlineHelp,
  FeatureHighlight,
} from "./ContextualTooltip";
export {
  LiveRegion,
  StatusRegion,
  AlertRegion,
  LoadingRegion,
  ProgressRegion,
  ErrorRegion,
} from "./LiveRegion";
export {
  AccessibleChart,
  ChartDescription,
  AccessibleChartLegend,
} from "./ChartAccessibility";
export { TopLoadingBar } from "./TopLoadingBar";
export {
  PageLoader,
  SimplePageLoader,
  DashboardLoader,
  ListLoader,
  FormLoader,
} from "./PageLoader";
export {
  ImageOptimized,
  AvatarOptimized,
  BackgroundImage,
  ImageGallery,
} from "./ImageOptimized";
export { ResourceHints, DNSPrefetch, PreloadCSS } from "./ResourceHints";
export { AccessibilityAuditor } from "./AccessibilityAuditor";
export {
  ChartPatternDefs,
  ChartDataTable,
  AccessibleLegend,
  AccessibleBarChart,
  generateChartSummary,
  useChartKeyboardNavigation,
  chartPatterns,
} from "./ChartAccessibilityEnhanced";
export { FinalTestChecklist } from "./FinalTestChecklist";
