import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import { HiArrowLeft } from 'react-icons/hi';
import axios from 'axios';
import { useState } from 'react';

import ProfileCard from '../../components/ProfileCard';
import RiskMeter from '../../components/RiskMeter';
import MatchHistory from '../../components/MatchHistory';
import LoadingScreen from '../../components/LoadingScreen';
import ErrorState from '../../components/ErrorState';
import CaptchaModal from '../../components/CaptchaModal';
import DetailedStats from '../../components/DetailedStats';
import type { UserProfile, ApiResponse } from '@vantage/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function ProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const [showCaptcha, setShowCaptcha] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['profile', id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const res = await axios.get<ApiResponse<UserProfile>>(`${API_URL}/api/profile/${id}`);
        return res.data;
      } catch (err: any) {
        if (err.response?.status === 429) {
          setShowCaptcha(true);
          return { requiresCaptcha: true, success: false };
        }
        throw err;
      }
    },
    enabled: !!id,
    retry: false
  });

  if (showCaptcha) return <CaptchaModal isOpen={true} onClose={() => router.push('/')} onSubmit={() => { setShowCaptcha(false); refetch(); }} isLoading={isLoading} />;
  if (isLoading) return <LoadingScreen />;
  if (error || (data && !data.success && !(data as any).requiresCaptcha)) {
    return <ErrorState title="Error" message="Profile not found or API error." onRetry={refetch} />;
  }
  if (!data?.data) return null;

  const profile = data.data;

  return (
    <>
      <Head>
        <title>{profile.steam.username} | Vantage</title>
      </Head>

      <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          
          <button 
            onClick={() => router.push('/')} 
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <HiArrowLeft /> Back to Search
          </button>

          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <ProfileCard profile={profile} />
              <DetailedStats profile={profile} />
              <MatchHistory faceitMatches={profile.faceit?.matchHistory} leetifyStats={profile.leetify} />
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="sticky top-6">
                <RiskMeter risk={profile.risk} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}