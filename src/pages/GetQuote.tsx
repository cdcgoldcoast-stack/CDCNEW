import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowLeft, Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import { generateContactPageSchema } from "@/lib/structured-data";
import ResponsiveImage from "@/components/ResponsiveImage";

const renovationOptions = [
  { id: "bathroom", label: "Bathroom" },
  { id: "kitchen", label: "Kitchen" },
  { id: "full-house", label: "Full House Living" },
  { id: "other", label: "Other Parts of the House" },
];

const budgetOptions = [
  { id: "5-20", label: "$5k – $20k" },
  { id: "20-40", label: "$20k – $40k" },
  { id: "40-80", label: "$40k – $80k" },
  { id: "80+", label: "$80k+" },
  { id: "unsure", label: "Unsure" },
  { id: "flexible", label: "Flexible" },
];

const renovationAfterImage =
  "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/RenovationAI.webp";
const renovationBeforeImage =
  "https://iqugsxeejieneyksfbza.supabase.co/storage/v1/object/public/gallery-images/Renovaton-before.webp";

const totalSteps = 5; // 1 invitation + 4 form steps

const GetQuote = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [website, setWebsite] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    suburb: "",
    postcode: "",
    renovations: [] as string[],
    budget: "",
  });

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const toggleRenovation = (id: string) => {
    const current = formData.renovations;
    const updated = current.includes(id)
      ? current.filter((r) => r !== id)
      : [...current, id];
    updateFormData("renovations", updated);
  };

  // Validation for each step
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 2) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Name is required";
      }
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      }
    }

    if (step === 3) {
      if (!formData.suburb.trim() && !formData.postcode.trim()) {
        newErrors.location = "Please enter either suburb or postcode";
      }
    }

    if (step === 4) {
      if (formData.renovations.length === 0) {
        newErrors.renovations = "Please select at least one renovation type";
      }
    }

    if (step === 5) {
      if (!formData.budget) {
        newErrors.budget = "Please select a budget";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setErrors({});
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate budget step before submitting
    if (!validateStep(5)) {
      return;
    }
    
    setSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke<{
        success?: boolean;
        error?: string;
      }>("save-enquiry", {
        body: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          suburb: formData.suburb || null,
          postcode: formData.postcode || null,
          renovations: formData.renovations,
          budget: formData.budget || null,
          source: "quote-form",
          website,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setSubmitted(true);
    } catch (error: unknown) {
      console.error("Error submitting enquiry:", error);
      const message = error instanceof Error ? error.message : "Something went wrong. Please try again later.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const formStepTitles = [
    "We'd love to get to know you",
    "Where are you located?",
    "What are you looking to renovate?",
    "Do you have a budget in mind?",
  ];

  const isInvitationStep = currentStep === 1;
  const formStepIndex = currentStep - 2; // 0-indexed for form steps (step 2 = index 0)
  const formStepsTotal = 4;

  // Generate ContactPage schema for SEO
  const contactSchema = generateContactPageSchema();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Free Quote | Gold Coast Home Renovation Consultation"
        description="Start your Gold Coast renovation journey. Get a free consultation and quote for your kitchen, bathroom, or whole-home renovation project."
        url="/get-quote"
        jsonLd={contactSchema}
      />
      <Header />

      <main className="flex-1 relative overflow-hidden pt-16 md:pt-20">
        <h1 className="sr-only">Get Your Free Renovation Plan</h1>
        {/* Expanding Background Panel */}
        <motion.div
          className="absolute inset-0 bg-primary z-0"
          initial={{ width: "50%" }}
          animate={{ 
            width: isInvitationStep && !submitted ? "50%" : "100%",
          }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        />

        <AnimatePresence mode="wait">
          {submitted ? (
            // Success Screen
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="relative min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] flex items-center justify-center z-10"
            >
              <div className="w-full max-w-2xl mx-auto px-6 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="space-y-6"
                >
                  <p className="text-white/60 text-sm tracking-widest uppercase">
                    Thank you, we have received your details
                  </p>
                  
                  <h2 className="font-display text-3xl lg:text-4xl xl:text-5xl text-white leading-tight italic">
                    This Is The Beginning Of Something Thoughtful.
                  </h2>
                  
                  <p className="text-white/80 text-lg lg:text-xl leading-relaxed max-w-xl mx-auto pt-2">
                    Not plans or drawings just yet.
                  </p>
                  
                  <p className="text-white/80 text-lg lg:text-xl leading-relaxed max-w-xl mx-auto">
                    First, we listen. We want to understand how you live now<br />and how you want to live next.
                  </p>
                  
                  <div className="pt-8">
                    <p className="text-white/60 text-base mb-4">
                      Until we speak, take a look around and get inspired.
                    </p>
                  
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link to="/projects">
                        <Button
                          variant="outline"
                          className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary px-8 h-14 text-sm tracking-widest uppercase font-medium"
                        >
                          View Our Projects
                        </Button>
                      </Link>
                      <Link to="/design-tools">
                        <Button
                          className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 px-8 h-14 text-sm tracking-widest uppercase font-medium"
                        >
                          Play With Design Tools
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : isInvitationStep ? (
            // Step 1: Invitation Screen (No Form)
            <motion.div
              key="invitation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="relative h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] flex flex-col lg:flex-row z-10 overflow-hidden"
            >
              {/* Left Side - Invitation Message */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative lg:w-1/2 flex items-center bg-primary"
              >
                <div className="w-full h-full flex items-center justify-center px-6 lg:px-12 xl:px-16">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -60 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    className="max-w-lg w-full"
                  >
                    <p className="text-white/70 text-sm tracking-widest uppercase mb-4">
                      Gold Coast Local Builder
                    </p>

                    <h2 className="font-display text-3xl lg:text-4xl xl:text-[2.75rem] text-white leading-[1.1] mb-4">
                      Get Your Free Renovation Plan
                    </h2>
                    <p className="text-white/75 text-[15px] leading-relaxed mb-6 max-w-sm">
                      We're here to listen, understand your needs, and see if we're the right fit for each other.
                    </p>

                    {/* Before / After showcase */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="relative rounded-xl overflow-hidden border border-white/20 h-36 lg:h-40 xl:h-44">
                        <div className="absolute top-2 left-2 right-2 z-10 flex items-center justify-between">
                          <span className="bg-white/90 text-primary/80 rounded-full px-2 py-0.5 text-[7px] tracking-[0.15em] uppercase font-medium">
                            Your Image
                          </span>
                          <span className="bg-white text-primary rounded-full px-2 py-0.5 text-[7px] tracking-[0.15em] uppercase font-medium">
                            Before
                          </span>
                        </div>
                        <ResponsiveImage
                          src={renovationBeforeImage}
                          alt="Example room before renovation planning"
                          width={1200}
                          height={900}
                          sizes="(min-width: 1024px) 24vw, 45vw"
                          loading="eager"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="relative rounded-xl overflow-hidden border border-white/20 h-36 lg:h-40 xl:h-44">
                        <div className="absolute top-2 left-2 right-2 z-10 flex items-center justify-between">
                          <span className="bg-white/90 text-primary/80 rounded-full px-2 py-0.5 text-[7px] tracking-[0.15em] uppercase font-medium">
                            CDC AI Renovator
                          </span>
                          <span className="bg-white text-primary rounded-full px-2 py-0.5 text-[7px] tracking-[0.15em] uppercase font-medium">
                            After
                          </span>
                        </div>
                        <ResponsiveImage
                          src={renovationAfterImage}
                          alt="Example room after renovation concept"
                          width={1200}
                          height={900}
                          sizes="(min-width: 1024px) 24vw, 45vw"
                          loading="eager"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Description + trust row */}
                    <p className="text-white/60 text-sm leading-relaxed mb-5">
                      See what's possible in your space and get a renovation plan designed around your lifestyle. From kitchens and bathrooms to full home transformations — honest pricing and quality craftsmanship.
                    </p>

                    <div className="flex items-center gap-2.5 bg-white/10 rounded-lg px-3 py-2 w-fit">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-white/90">Google Reviews</span>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} className="w-3 h-3 text-amber-400 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-white/70 font-medium">4.9</span>
                      </div>
                    </div>

                    {/* Continue Button - Mobile Only (appears before "What happens next") */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                      className="lg:hidden mt-6"
                    >
                      <div className="space-y-4">
                        <Button
                          onClick={nextStep}
                          className="bg-white text-primary hover:bg-white/90 px-10 h-11 text-sm"
                        >
                          Start My Renovation Plan
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>

                        {/* Skip the queue section */}
                        <div className="flex items-center gap-3">
                          <div className="h-px bg-white/30 flex-1" />
                          <span className="text-white/50 text-xs uppercase tracking-wider">or</span>
                          <div className="h-px bg-white/30 flex-1" />
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                          <p className="text-white font-medium text-base">
                            Want to skip the queue?
                          </p>
                          <a
                            href="tel:1300020232"
                            className="inline-flex items-center justify-center text-xs font-semibold tracking-wider uppercase px-5 py-2.5 bg-white text-primary hover:bg-white/90 transition-all duration-300 rounded"
                          >
                            Call Now
                          </a>
                        </div>
                        <p className="text-white/60 text-xs">
                          Lines open 7:30AM – 5PM, Monday to Saturday
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Right Side - What Happens Next */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex-1 flex flex-col items-center justify-center px-6 lg:px-12 xl:px-16 bg-background"
              >
                <div className="max-w-md w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <h2 className="text-muted-foreground text-xs tracking-widest uppercase mb-5">
                      Here's what happens next
                    </h2>

                    <div className="space-y-4 mb-8">
                      {[
                        "We start by understanding your needs.",
                        "We learn about your space and lifestyle.",
                        "We see if we're the right fit for each other.",
                        "Only then do we talk details and next steps.",
                      ].map((text, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                          className="flex items-start gap-4"
                        >
                          <span className="text-primary/30 font-display text-base">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <p className="text-foreground text-base leading-relaxed">
                            {text}
                          </p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Continue Button - Desktop Only */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 }}
                      className="hidden lg:block"
                    >
                      <div className="space-y-4">
                        <Button
                          onClick={nextStep}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 h-11 text-sm tracking-wide"
                        >
                          Start My Renovation Plan
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>

                        {/* Skip the queue section */}
                        <div className="flex items-center gap-3">
                          <div className="h-px bg-primary/20 flex-1" />
                          <span className="text-primary/40 text-xs uppercase tracking-wider">or</span>
                          <div className="h-px bg-primary/20 flex-1" />
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                          <p className="text-primary/80 font-medium text-base">
                            Want to skip the queue?
                          </p>
                          <a
                            href="tel:1300020232"
                            className="inline-flex items-center justify-center text-xs font-semibold tracking-wider uppercase px-5 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 rounded"
                          >
                            1300 020 232
                          </a>
                        </div>
                        <p className="text-primary/50 text-xs">
                          Lines open 7:30AM – 5PM, Monday to Saturday
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            // Steps 2-5: Form Experience on Full Red Background
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="relative min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 z-10"
            >
              <div className="w-full max-w-xl mx-auto px-6">
                {/* Progress Indicator */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="flex items-center justify-center gap-2 mb-10"
                >
                  {Array.from({ length: formStepsTotal }).map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        "h-1 rounded-full transition-all duration-500",
                        index === formStepIndex
                          ? "w-10 bg-white"
                          : index < formStepIndex
                          ? "w-10 bg-white/50"
                          : "w-10 bg-white/20"
                      )}
                    />
                  ))}
                </motion.div>

                {/* Step Title */}
                <motion.p
                  key={`step-title-${currentStep}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-center text-white text-xl lg:text-2xl font-display mb-8"
                >
                  {formStepTitles[formStepIndex]}
                </motion.p>

                {/* Form */}
                <form onSubmit={(e) => {
                  e.preventDefault();
                  // Only allow form submission on final step
                  if (currentStep === totalSteps) {
                    handleSubmit(e);
                  } else {
                    // If Enter is pressed on earlier steps, advance to next step
                    nextStep();
                  }
                }}>
                  <div className="hidden" aria-hidden="true">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      type="text"
                      value={website}
                      onChange={(event) => setWebsite(event.target.value)}
                      autoComplete="off"
                      tabIndex={-1}
                    />
                  </div>
                  <AnimatePresence mode="wait">
                    {/* Step 2: Personal Details */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step-2"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="space-y-5"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="fullName" className="text-white/90">
                            Name <span className="text-white/60">*</span>
                          </Label>
                          <Input
                            id="fullName"
                            value={formData.fullName}
                            onChange={(e) => updateFormData("fullName", e.target.value)}
                            placeholder="Your name"
                            className={cn(
                              "h-12 text-base bg-background/95 border-background/70 text-foreground placeholder:text-foreground/50 focus:border-background focus:ring-background/40",
                              errors.fullName && "border-white/60"
                            )}
                          />
                          {errors.fullName && (
                            <p className="text-white/80 text-sm">{errors.fullName}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-white/90">
                            Email <span className="text-white/60">*</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateFormData("email", e.target.value)}
                            placeholder="your@email.com"
                            className={cn(
                              "h-12 text-base bg-background/95 border-background/70 text-foreground placeholder:text-foreground/50 focus:border-background focus:ring-background/40",
                              errors.email && "border-white/60"
                            )}
                          />
                          {errors.email && (
                            <p className="text-white/80 text-sm">{errors.email}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-white/90">
                            Phone Number <span className="text-white/60">*</span>
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => updateFormData("phone", e.target.value)}
                            placeholder="Your phone number"
                            className={cn(
                              "h-12 text-base bg-background/95 border-background/70 text-foreground placeholder:text-foreground/50 focus:border-background focus:ring-background/40",
                              errors.phone && "border-white/60"
                            )}
                          />
                          {errors.phone && (
                            <p className="text-white/80 text-sm">{errors.phone}</p>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Location */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step-3"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="space-y-5"
                      >
                        <p className="text-sm text-white/60 text-center mb-2">
                          Enter suburb or postcode <span className="text-white/60">*</span>
                        </p>
                        {errors.location && (
                          <p className="text-white/80 text-sm text-center">{errors.location}</p>
                        )}
                        <div className="space-y-2">
                          <Label htmlFor="suburb" className="text-white/90">
                            Suburb
                          </Label>
                          <Input
                            id="suburb"
                            value={formData.suburb}
                            onChange={(e) => {
                              updateFormData("suburb", e.target.value);
                              if (errors.location) setErrors((prev) => ({ ...prev, location: "" }));
                            }}
                            placeholder="Your suburb"
                            className={cn(
                              "h-12 text-base bg-background/95 border-background/70 text-foreground placeholder:text-foreground/50 focus:border-background focus:ring-background/40",
                              errors.location && "border-white/60"
                            )}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="postcode" className="text-white/90">
                            Postcode
                          </Label>
                          <Input
                            id="postcode"
                            value={formData.postcode}
                            onChange={(e) => {
                              updateFormData("postcode", e.target.value);
                              if (errors.location) setErrors((prev) => ({ ...prev, location: "" }));
                            }}
                            placeholder="Your postcode"
                            className={cn(
                              "h-12 text-base bg-background/95 border-background/70 text-foreground placeholder:text-foreground/50 focus:border-background focus:ring-background/40",
                              errors.location && "border-white/60"
                            )}
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Step 4: Renovation Type */}
                    {currentStep === 4 && (
                      <motion.div
                        key="step-4"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="space-y-6"
                      >
                        <p className="text-sm text-white/60 text-center">
                          Select all that apply <span className="text-white/60">*</span>
                        </p>
                        {errors.renovations && (
                          <p className="text-white/80 text-sm text-center">{errors.renovations}</p>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {renovationOptions.map((option) => (
                            <button
                              key={option.id}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleRenovation(option.id);
                                if (errors.renovations) {
                                  setErrors((prev) => ({ ...prev, renovations: "" }));
                                }
                              }}
                              className={cn(
                                "relative border rounded-lg px-6 py-5 text-left transition-all duration-200",
                                formData.renovations.includes(option.id)
                                  ? "border-white bg-white/20"
                                  : "border-white/30 bg-white/5 hover:border-white/50 hover:bg-white/10"
                              )}
                            >
                              <span className="text-base text-white">
                                {option.label}
                              </span>
                              {formData.renovations.includes(option.id) && (
                                <Check className="absolute top-4 right-4 w-5 h-5 text-white" />
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Step 5: Budget */}
                    {currentStep === 5 && (
                      <motion.div
                        key="step-5"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="space-y-6"
                      >
                        <p className="text-sm text-white/60 text-center">
                          Select your approximate budget <span className="text-white/60">*</span>
                        </p>
                        {errors.budget && (
                          <p className="text-white/80 text-sm text-center">{errors.budget}</p>
                        )}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {budgetOptions.map((option) => (
                            <button
                              key={option.id}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                updateFormData("budget", option.id);
                              }}
                              className={cn(
                                "relative border rounded-lg px-5 py-4 text-center transition-all duration-200",
                                formData.budget === option.id
                                  ? "border-white bg-white/20"
                                  : "border-white/30 bg-white/5 hover:border-white/50 hover:bg-white/10"
                              )}
                            >
                              <span className="text-base text-white">
                                {option.label}
                              </span>
                              {formData.budget === option.id && (
                                <Check className="absolute top-3 right-3 w-4 h-4 text-white" />
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="flex items-center justify-between mt-10 pt-8 border-t border-white/20"
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={prevStep}
                      className="text-white/70 hover:text-white hover:bg-white/10"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>

                    {currentStep < totalSteps ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="bg-white text-primary hover:bg-white/90 px-8 h-12"
                      >
                        Start My Renovation Plan
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="bg-white text-primary hover:bg-white/90 px-8 h-12"
                      >
                        {submitting ? "Submitting..." : "Submit Enquiry"}
                        <Check className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </motion.div>
                </form>

                {/* Trust Indicators */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="mt-12 text-center"
                >
                  <p className="text-sm text-white/50">
                    Free consultation • No obligation • Response within 24 hours
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <section className="py-10 md:py-14 border-t border-foreground/10 bg-background">
        <div className="container-wide">
          <h2 className="font-serif italic text-2xl md:text-3xl text-primary mb-3">
            Helpful Renovation Planning Links
          </h2>
          <p className="text-foreground/70 mb-4 max-w-3xl">
            While we review your enquiry, these guides can help you refine scope, style direction, and budget priorities.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm md:text-base">
            <Link to="/services" className="text-primary hover:text-primary/70 underline underline-offset-4">
              Compare kitchen, bathroom, and whole-home service options
            </Link>
            <Link to="/projects" className="text-primary hover:text-primary/70 underline underline-offset-4">
              Review recent renovation project case studies
            </Link>
            <Link to="/gallery" className="text-primary hover:text-primary/70 underline underline-offset-4">
              Browse project gallery inspiration by renovation style
            </Link>
            <Link to="/design-tools/ai-generator/intro" className="text-primary hover:text-primary/70 underline underline-offset-4">
              Preview ideas in the AI renovation generator
            </Link>
            <Link to="/design-tools/moodboard" className="text-primary hover:text-primary/70 underline underline-offset-4">
              Build a moodboard to share during consultation
            </Link>
            <Link to="/life-stages" className="text-primary hover:text-primary/70 underline underline-offset-4">
              Match renovation scope to your life stage plan
            </Link>
          </div>
        </div>
      </section>

      {!isInvitationStep && <Footer />}
    </div>
  );
};

export default GetQuote;
