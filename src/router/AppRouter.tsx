/**
 * Application Router
 * Centralized routing logic for the application
 */

import { lazy, Suspense, useState } from "react";
import { PageSpinner } from "../components/LoadingStates";
import { ROUTES, type Page } from "../config/routes";
import { mockPlans, mockInviteData, mockGameDetails, mockParticipants } from "../data/mockData";
import { toast } from "sonner@2.0.3";
import { AddCreditsModal } from "../components/AddCreditsModal";
import { useAuth } from "../contexts/AuthContext";

// Lazy load all page components
const LandingPage = lazy(() => import("../components/LandingPage").then(m => ({ default: m.LandingPage })));
const BookingFlow = lazy(() => import("../components/BookingFlow").then(m => ({ default: m.BookingFlow })));
const Login = lazy(() => import("../components/Login").then(m => ({ default: m.Login })));
const Cadastro = lazy(() => import("../components/Cadastro").then(m => ({ default: m.Cadastro })));
const ClientDashboardEnhanced = lazy(() => import("../components/ClientDashboardEnhanced").then(m => ({ default: m.ClientDashboardEnhanced })));
const ManagerDashboard = lazy(() => import("../components/ManagerDashboard").then(m => ({ default: m.ManagerDashboard })));
const PostGameRating = lazy(() => import("../components/PostGameRating").then(m => ({ default: m.PostGameRating })));
const InviteView = lazy(() => import("../components/InviteView").then(m => ({ default: m.InviteView })));
const DemoShowcase = lazy(() => import("../components/DemoShowcase").then(m => ({ default: m.DemoShowcase })));
const UserProfile = lazy(() => import("../components/UserProfile").then(m => ({ default: m.UserProfile })));
const TeamsPage = lazy(() => import("../components/TeamsPage").then(m => ({ default: m.TeamsPage })));
const CourtDetails = lazy(() => import("../components/CourtDetails").then(m => ({ default: m.CourtDetails })));
const TransactionHistory = lazy(() => import("../components/TransactionHistory").then(m => ({ default: m.TransactionHistory })));
const FAQ = lazy(() => import("../components/FAQ").then(m => ({ default: m.FAQ })));
const Settings = lazy(() => import("../components/Settings").then(m => ({ default: m.Settings })));
const Terms = lazy(() => import("../components/Terms").then(m => ({ default: m.Terms })));
const PaymentFlow = lazy(() => import("../components/payment/PaymentFlow").then(m => ({ default: m.PaymentFlow })));
const SubscriptionPlans = lazy(() => import("../components/SubscriptionPlans").then(m => ({ default: m.SubscriptionPlans })));
const SubscriptionManagement = lazy(() => import("../components/SubscriptionManagement").then(m => ({ default: m.SubscriptionManagement })));
const NotFound = lazy(() => import("../components/NotFound").then(m => ({ default: m.NotFound })));

interface AppRouterProps {
  currentPage: Page;
  navigate: (page: Page) => void;
  isAuthenticated: boolean;
  userRole?: "client" | "manager";
  showRatingModal: boolean;
  setShowRatingModal: (show: boolean) => void;
  currentSubscription?: string;
  setCurrentSubscription: (id?: string) => void;
}

export function AppRouter({
  currentPage,
  navigate,
  isAuthenticated,
  userRole,
  showRatingModal,
  setShowRatingModal,
  currentSubscription,
  setCurrentSubscription,
}: AppRouterProps) {
  const { user } = useAuth();
  const [showAddCreditsModal, setShowAddCreditsModal] = useState(false);

  return (
    <>
      <Suspense fallback={<PageSpinner />}>
        {/* Landing Page */}
        {currentPage === ROUTES.LANDING && (
          <LandingPage onNavigate={navigate} />
        )}

        {/* Booking Flow */}
        {currentPage === ROUTES.BOOKING && (
          <BookingFlow onBack={() => navigate(isAuthenticated ? ROUTES.CLIENT_DASHBOARD : ROUTES.LANDING)} />
        )}

        {/* Authentication */}
        {currentPage === ROUTES.LOGIN && (
          <Login 
            onBack={() => navigate(ROUTES.LANDING)}
            onLoginClient={() => navigate(ROUTES.CLIENT_DASHBOARD)}
            onLoginManager={() => navigate(ROUTES.MANAGER_DASHBOARD)}
            onSignup={() => navigate(ROUTES.CADASTRO)}
          />
        )}

        {currentPage === ROUTES.CADASTRO && (
          <Cadastro 
            onBack={() => navigate(ROUTES.LOGIN)}
            onComplete={() => navigate(ROUTES.CLIENT_DASHBOARD)}
          />
        )}

        {/* Client Dashboard */}
        {currentPage === ROUTES.CLIENT_DASHBOARD && isAuthenticated && (
          <ClientDashboardEnhanced 
            onBack={() => navigate(ROUTES.BOOKING)}
            onNavigateToTeams={() => navigate(ROUTES.TEAMS)}
            onNavigateToTransactions={() => navigate(ROUTES.TRANSACTIONS)}
            onNavigateToCourtDetails={() => navigate(ROUTES.COURT_DETAILS)}
            onNavigateToSubscription={() => navigate(ROUTES.SUBSCRIPTION_MANAGEMENT)}
          />
        )}

        {/* Manager Dashboard */}
        {currentPage === ROUTES.MANAGER_DASHBOARD && isAuthenticated && (
          <ManagerDashboard onBack={() => navigate(ROUTES.LANDING)} />
        )}

        {/* User Profile */}
        {currentPage === ROUTES.USER_PROFILE && isAuthenticated && (
          <UserProfile 
            onBack={() => navigate(userRole === "manager" ? ROUTES.MANAGER_DASHBOARD : ROUTES.CLIENT_DASHBOARD)}
            onSettings={() => navigate(ROUTES.SETTINGS)}
          />
        )}

        {/* Teams */}
        {currentPage === ROUTES.TEAMS && isAuthenticated && (
          <TeamsPage onBack={() => navigate(ROUTES.CLIENT_DASHBOARD)} />
        )}

        {/* Court Details */}
        {currentPage === ROUTES.COURT_DETAILS && (
          <CourtDetails 
            courtId="1"
            onBack={() => navigate(isAuthenticated ? ROUTES.CLIENT_DASHBOARD : ROUTES.LANDING)}
            onBookNow={() => navigate(ROUTES.BOOKING)}
          />
        )}

        {/* Transactions */}
        {currentPage === ROUTES.TRANSACTIONS && isAuthenticated && (
          <TransactionHistory 
            onBack={() => navigate(ROUTES.CLIENT_DASHBOARD)}
            onAddCredits={() => setShowAddCreditsModal(true)}
          />
        )}

        {/* FAQ */}
        {currentPage === ROUTES.FAQ && (
          <FAQ onBack={() => navigate(ROUTES.LANDING)} />
        )}

        {/* Terms */}
        {currentPage === ROUTES.TERMS && (
          <Terms onBack={() => navigate(ROUTES.LANDING)} />
        )}

        {/* Settings */}
        {currentPage === ROUTES.SETTINGS && isAuthenticated && (
          <Settings onBack={() => navigate(userRole === "manager" ? ROUTES.MANAGER_DASHBOARD : ROUTES.CLIENT_DASHBOARD)} />
        )}

        {/* Subscription Plans */}
        {currentPage === ROUTES.SUBSCRIPTION_PLANS && (
          <SubscriptionPlans
            currentPlan={currentSubscription}
            onSelectPlan={(planId) => {
              setCurrentSubscription(planId);
              toast.success(`Plano ${mockPlans.find(p => p.id === planId)?.name} selecionado!`);
              setTimeout(() => navigate(ROUTES.SUBSCRIPTION_MANAGEMENT), 1500);
            }}
            onBack={() => navigate(isAuthenticated ? ROUTES.CLIENT_DASHBOARD : ROUTES.LANDING)}
          />
        )}

        {/* Subscription Management */}
        {currentPage === ROUTES.SUBSCRIPTION_MANAGEMENT && currentSubscription && (
          <SubscriptionManagement
            currentPlan={mockPlans.find(p => p.id === currentSubscription)!}
            onBack={() => navigate(ROUTES.CLIENT_DASHBOARD)}
            onChangePlan={() => navigate(ROUTES.SUBSCRIPTION_PLANS)}
          />
        )}

        {/* 404 Page */}
        {currentPage === ROUTES.NOT_FOUND && (
          <NotFound
            onGoHome={() => navigate(ROUTES.LANDING)}
            onGoBack={() => window.history.back()}
            showSearch
          />
        )}

        {/* Payment Flow */}
        {currentPage === ROUTES.PAYMENT && (
          <PaymentFlow
            bookingDetails={{
              court: "Quadra 1 - Society",
              date: "20 de Outubro de 2025",
              time: "19:00",
              duration: "1 hora",
              basePrice: 120,
            }}
            onBack={() => navigate(isAuthenticated ? ROUTES.BOOKING : ROUTES.LANDING)}
            onComplete={() => {
              toast.success("Reserva confirmada com sucesso!");
              setTimeout(() => navigate(isAuthenticated ? ROUTES.CLIENT_DASHBOARD : ROUTES.LANDING), 2000);
            }}
          />
        )}

        {/* Invite View */}
        {currentPage === ROUTES.INVITE_VIEW && (
          <InviteView 
            inviteData={mockInviteData}
            onAccept={(acceptAll) => {
              toast.success(
                acceptAll 
                  ? "Convite aceito para todos os jogos!" 
                  : "Convite aceito com sucesso!"
              );
              setTimeout(() => navigate(ROUTES.LOGIN), 2000);
            }}
            onDecline={() => {
              toast.info("Convite recusado");
              navigate(ROUTES.LANDING);
            }}
          />
        )}

        {/* Demo Showcase */}
        {currentPage === ROUTES.LANDING && !isAuthenticated && (
          <DemoShowcase
            onNavigateToInvite={() => navigate(ROUTES.INVITE_VIEW)}
            onShowRating={() => setShowRatingModal(true)}
            onNavigateToCourt={() => navigate(ROUTES.COURT_DETAILS)}
            onNavigateToPayment={() => navigate(ROUTES.PAYMENT)}
          />
        )}
      </Suspense>

      {/* Post Game Rating Modal */}
      <Suspense fallback={null}>
        <PostGameRating
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          gameDetails={mockGameDetails}
          participants={mockParticipants}
          isOrganizer={true}
        />
      </Suspense>

      {/* Add Credits Modal */}
      {user && (
        <AddCreditsModal
          open={showAddCreditsModal}
          onOpenChange={setShowAddCreditsModal}
          currentBalance={user.credits || 0}
        />
      )}
    </>
  );
}
