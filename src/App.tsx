import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Sparkles, 
  CheckCircle2
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { OverviewMetrics } from './components/OverviewMetrics';
import { GradingSystemSelector } from './components/GradingSystemSelector';
import { SemesterCard } from './components/SemesterCard';
import { NavigationTabs, ActiveTab } from './components/NavigationTabs';
import { TargetPlanner } from './components/TargetPlanner';
import { PercentageConverterTool } from './components/PercentageConverterTool';
import { AnalyticsModal } from './components/AnalyticsModal';
import { ReportModal } from './components/ReportModal';
import { FaqAndGuideSection } from './components/FaqAndGuideSection';
import { Footer } from './components/Footer';
import { AdPlacement } from './components/AdPlacement';
import { StickyBottomAd } from './components/StickyBottomAd';
import { AdSettingsModal } from './components/AdSettingsModal';

import { GRADING_SYSTEMS, SAMPLE_DATA } from './types/data';
import { Semester, GradingSystem, Course } from './types/cgpa';
import { calculateCGPA } from './utils/calculator';
import confetti from 'canvas-confetti';

const STORAGE_KEY_SEMESTERS = 'gradeflow_semesters_v1';
const STORAGE_KEY_SYSTEM = 'gradeflow_grading_system_v1';
const STORAGE_KEY_THEME = 'gradeflow_theme_mode_v1';
const STORAGE_KEY_TARGET = 'gradeflow_target_cgpa_v1';
const STORAGE_KEY_PROFILE = 'gradeflow_student_profile_v1';
const STORAGE_KEY_ADSENSE = 'gradeflow_adsense_client';
const STORAGE_KEY_ADSTERRA = 'gradeflow_adsterra_key';
const STORAGE_KEY_MONETAG = 'gradeflow_monetag_zone';
const STORAGE_KEY_SHOW_ADS = 'gradeflow_show_ads';

export default function App() {
  // Dark mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved !== null) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Active Grading System
  const [currentSystem, setCurrentSystem] = useState<GradingSystem>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SYSTEM);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return GRADING_SYSTEMS[0]; // Default 10.0 scale
  });

  // Semesters list
  const [semesters, setSemesters] = useState<Semester[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SEMESTERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return SAMPLE_DATA.scale_4_bd_ugc;
  });

  // Target CGPA
  const [targetCgpa, setTargetCgpa] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TARGET);
    if (saved) return parseFloat(saved) || 3.8;
    return 3.8;
  });

  // Student profile metadata
  const [profile, setProfile] = useState<{
    name: string;
    major: string;
    institution: string;
  }>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      name: 'Tanvir Ahmed',
      major: 'Computer Science & Engineering (CSE)',
      institution: 'BUET / University of Dhaka / NSU',
    };
  });

  // Active view tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('calculator');

  // Ad networks state
  const [showAds, setShowAds] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SHOW_ADS);
    return saved !== null ? saved === 'true' : true;
  });
  const [adsenseClient, setAdsenseClient] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_ADSENSE) || '';
  });
  const [adsterraKey, setAdsterraKey] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_ADSTERRA) || '';
  });
  const [monetagZoneId, setMonetagZoneId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_MONETAG) || '';
  });
  const [isAdSettingsOpen, setIsAdSettingsOpen] = useState(false);

  // Modals state
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hidden file input for JSON import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Apply dark mode class to root HTML
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'light');
    }
  }, [darkMode]);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SEMESTERS, JSON.stringify(semesters));
  }, [semesters]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SYSTEM, JSON.stringify(currentSystem));
  }, [currentSystem]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TARGET, targetCgpa.toString());
  }, [targetCgpa]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SHOW_ADS, showAds.toString());
  }, [showAds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ADSENSE, adsenseClient);
  }, [adsenseClient]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ADSTERRA, adsterraKey);
  }, [adsterraKey]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MONETAG, monetagZoneId);
  }, [monetagZoneId]);

  // Show temporary toast message
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Perform overall calculations
  const { cgpa, totalCredits, earnedCredits } = calculateCGPA(semesters, currentSystem);

  const totalCourses = semesters.reduce((sum, s) => sum + s.courses.length, 0);

  // Semester Operations
  const handleAddSemester = () => {
    const nextSemNumber = semesters.length + 1;
    const defaultGrade = currentSystem.grades[0]?.grade || 'A';
    const newSem: Semester = {
      id: 'sem-' + Date.now(),
      name: `Semester ${nextSemNumber}`,
      targetSgpa: parseFloat((currentSystem.maxScale * 0.85).toFixed(1)),
      courses: [
        {
          id: 'c-' + Date.now() + '-1',
          code: `CS${nextSemNumber}01`,
          name: 'Core Course 1',
          credits: 4,
          grade: defaultGrade,
          isCompleted: true,
        },
        {
          id: 'c-' + Date.now() + '-2',
          code: `CS${nextSemNumber}02`,
          name: 'Core Course 2',
          credits: 4,
          grade: defaultGrade,
          isCompleted: true,
        },
        {
          id: 'c-' + Date.now() + '-3',
          code: `CS${nextSemNumber}03`,
          name: 'Elective / Laboratory',
          credits: 3,
          grade: defaultGrade,
          isCompleted: true,
        },
      ],
    };
    setSemesters([...semesters, newSem]);
    showToast(`Added Semester ${nextSemNumber}`);
  };

  const handleUpdateSemester = (index: number, updated: Semester) => {
    const copy = [...semesters];
    copy[index] = updated;
    setSemesters(copy);
  };

  const handleDeleteSemester = (index: number) => {
    if (semesters.length <= 1) {
      showToast('Cannot delete the last remaining semester.');
      return;
    }
    const name = semesters[index].name;
    const copy = semesters.filter((_, i) => i !== index);
    setSemesters(copy);
    showToast(`Removed ${name}`);
  };

  const handleDuplicateSemester = (index: number) => {
    const target = semesters[index];
    const duplicatedCourses: Course[] = target.courses.map((c, i) => ({
      ...c,
      id: 'c-' + Date.now() + '-' + i,
      isCompleted: false, // new semester default
    }));
    const newSem: Semester = {
      id: 'sem-' + Date.now(),
      name: `${target.name} (Copy)`,
      targetSgpa: target.targetSgpa,
      courses: duplicatedCourses,
    };
    const copy = [...semesters];
    copy.splice(index + 1, 0, newSem);
    setSemesters(copy);
    showToast(`Duplicated ${target.name}`);
  };

  // Reset all data
  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all semesters and courses?')) {
      const defaultGrade = currentSystem.grades[0]?.grade || 'A';
      const freshSem: Semester = {
        id: 'sem-' + Date.now(),
        name: 'Semester 1',
        courses: [
          { id: 'c-1', code: 'CS101', name: 'Introduction to Programming', credits: 4, grade: defaultGrade, isCompleted: true },
          { id: 'c-2', code: 'MA101', name: 'Engineering Mathematics', credits: 4, grade: defaultGrade, isCompleted: true },
          { id: 'c-3', code: 'PH101', name: 'Physics / Mechanics', credits: 3, grade: defaultGrade, isCompleted: true },
        ],
      };
      setSemesters([freshSem]);
      showToast('All semesters reset to clean state.');
    }
  };

  // Load predefined sample data
  const handleLoadSample = () => {
    const sample = SAMPLE_DATA[currentSystem.id] || SAMPLE_DATA['scale_4_bd_ugc'] || SAMPLE_DATA['scale_10_indian'];
    setSemesters(sample);
    showToast(`Loaded ${currentSystem.name.split('(')[0].trim()} demo curriculum.`);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.8 },
    });
  };

  // Export JSON file
  const handleExportJSON = () => {
    const dataToExport = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      gradingSystem: currentSystem,
      profile,
      targetCgpa,
      semesters,
    };
    const jsonStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gradeflow-cgpa-record-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Exported complete CGPA profile to JSON file.');
  };

  // Import JSON file
  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed.semesters && Array.isArray(parsed.semesters)) {
          setSemesters(parsed.semesters);
          if (parsed.gradingSystem) setCurrentSystem(parsed.gradingSystem);
          if (parsed.targetCgpa) setTargetCgpa(parsed.targetCgpa);
          if (parsed.profile) setProfile(parsed.profile);
          showToast('Successfully imported academic data!');
        } else {
          showToast('Invalid JSON file schema.');
        }
      } catch (err) {
        showToast('Error parsing JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Share text summary
  const handleShareSummary = () => {
    const text = `🎓 My Academic CGPA Summary:\n• CGPA: ${cgpa.toFixed(2)} / ${currentSystem.maxScale}\n• Completed Credits: ${earnedCredits}/${totalCredits}\n• Semesters: ${semesters.length}\n• Calculated with GradeFlow CGPA Pro`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast('Copied CGPA summary to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors flex flex-col font-sans">
      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportFileChange}
        accept=".json"
        className="hidden"
      />

      {/* Navigation Header */}
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        onReset={handleResetData}
        onExport={handleExportJSON}
        onImportClick={() => fileInputRef.current?.click()}
        onLoadSample={handleLoadSample}
        onShare={handleShareSummary}
        onOpenAdSettings={() => setIsAdSettingsOpen(true)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* Top Hero / Header Section */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Open Source CGPA & SGPA Engine
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Academic Performance & CGPA Calculator
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                Accurate semester-by-semester credit weighting, AICTE percentage conversion, future target forecasting, and printable transcript reports.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddSemester}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm shadow-indigo-500/20 active:scale-95"
              >
                <Plus className="w-4 h-4" /> Add Semester
              </button>
            </div>
          </div>
        </div>

        {/* 4 Key Summary Performance Cards */}
        <OverviewMetrics
          cgpa={cgpa}
          totalCredits={totalCredits}
          earnedCredits={earnedCredits}
          gradingSystem={currentSystem}
          targetCgpa={targetCgpa}
          semesterCount={semesters.length}
          totalCourses={totalCourses}
        />

        {/* Comfortable Top Leaderboard Ad Slot (Zero CLS layout safe) */}
        {showAds && (
          <AdPlacement
            slotType="banner-728x90"
            adsenseClient={adsenseClient}
            adsenseSlot="1234567890"
            adsterraKey={adsterraKey}
            monetagZoneId={monetagZoneId}
            placeholderLabel="Top Leaderboard Banner • 728×90 (AdSense / Adsterra / Monetag)"
            className="my-5 print:hidden"
          />
        )}

        <div className="my-6">
          {/* Grading System Selector & Grade Point Customizer */}
          <GradingSystemSelector
            currentSystem={currentSystem}
            onSelectSystem={(sys) => {
              setCurrentSystem(sys);
              showToast(`Switched to ${sys.name}`);
            }}
            onUpdateSystem={(sys) => setCurrentSystem(sys)}
          />

          {/* Navigation Views Tab Bar */}
          <NavigationTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenAnalytics={() => setIsAnalyticsOpen(true)}
            onOpenReport={() => setIsReportOpen(true)}
            semesterCount={semesters.length}
          />

          {/* Tab 1: Interactive Semesters List */}
          {activeTab === 'calculator' && (
            <div className="space-y-4">
              {semesters.map((semester, idx) => (
                <SemesterCard
                  key={semester.id}
                  semester={semester}
                  semesterIndex={idx}
                  gradingSystem={currentSystem}
                  onUpdateSemester={(updated) => handleUpdateSemester(idx, updated)}
                  onDeleteSemester={() => handleDeleteSemester(idx)}
                  onDuplicateSemester={() => handleDuplicateSemester(idx)}
                />
              ))}

              {/* Bottom Add Semester prompt */}
              <div className="text-center py-6">
                <button
                  type="button"
                  onClick={handleAddSemester}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-dashed border-indigo-300 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-xs font-bold transition-colors shadow-2xs"
                >
                  <Plus className="w-4 h-4" /> Add Next Semester Term
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Goal & Target SGPA Planner */}
          {activeTab === 'target' && (
            <div className="space-y-6">
              <TargetPlanner
                currentCgpa={cgpa}
                currentCredits={earnedCredits || totalCredits}
                gradingSystem={currentSystem}
                targetCgpa={targetCgpa}
                onUpdateTargetCgpa={(val) => setTargetCgpa(val)}
              />
            </div>
          )}

          {/* Tab 3: Percentage & Multiplier Conversion Tool */}
          {activeTab === 'converter' && (
            <div className="space-y-6">
              <PercentageConverterTool
                gradingSystem={currentSystem}
                currentCgpa={cgpa}
              />
            </div>
          )}

          {/* Native In-Feed Sponsored Banner */}
          {showAds && (
            <AdPlacement
              slotType="banner-native"
              adsenseClient={adsenseClient}
              adsenseSlot="9876543210"
              adsterraKey={adsterraKey}
              monetagZoneId={monetagZoneId}
              placeholderLabel="Native In-Content Recommendation • Adsterra / Monetag / AdSense"
              className="my-6 print:hidden"
            />
          )}

          {/* Educational Guidelines & University Reference FAQ */}
          <FaqAndGuideSection />
        </div>
      </main>

      {/* Analytics Modal */}
      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        semesters={semesters}
        gradingSystem={currentSystem}
        priorCgpa={0}
        priorCredits={0}
      />

      {/* Transcript & Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        semesters={semesters}
        gradingSystem={currentSystem}
        studentName={profile.name}
        major={profile.major}
        institution={profile.institution}
      />

      {/* Monetization / Ad Network Settings Modal */}
      <AdSettingsModal
        isOpen={isAdSettingsOpen}
        onClose={() => setIsAdSettingsOpen(false)}
        adsenseClient={adsenseClient}
        setAdsenseClient={setAdsenseClient}
        adsterraKey={adsterraKey}
        setAdsterraKey={setAdsterraKey}
        monetagZoneId={monetagZoneId}
        setMonetagZoneId={setMonetagZoneId}
        showAds={showAds}
        setShowAds={setShowAds}
      />

      {/* Dismissible Sticky Bottom Banner */}
      {showAds && (
        <StickyBottomAd
          adsenseClient={adsenseClient}
          adsenseSlot="5544332211"
          adsterraKey={adsterraKey}
          monetagZoneId={monetagZoneId}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

