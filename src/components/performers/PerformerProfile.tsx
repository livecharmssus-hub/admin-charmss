import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Upload,
  Link as LinkIcon,
  Calendar,
  DollarSign,
  TrendingUp,
  Star,
} from 'lucide-react';
import { Performer, PerformerProfile as PerformerProfileType } from '../../app/types/performers.types';
import PerformerProfileService from '../../app/services/performerProfile.service';

interface PerformerProfileProps {
  performer: Performer | null;
  onClose: () => void;
}

export default function PerformerProfile({ performer, onClose }: PerformerProfileProps) {
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [_profileDataFromApi, setProfileDataFromApi] = useState<PerformerProfileType | null>(null);

  const [profileData, setProfileData] = useState({
    nickname: performer?.stage_name ?? '',
    headline: performer?.bio ?? '',
    myLive: 'Welcome! Share your story and connect with fans.',
    age: 26,
    height: 165,
    weight: 60,
    zodiac: 'Sagittarius',
    ethnicity: 'White',
    sexualPreference: 'Straight',
    hairColor: 'Brown',
    eyeColor: 'Green',
    build: 'Slender',
    country: performer?.country ?? '',
    twitterLink: '',
    instagramLink: '',
    videoCallRate: 18,
    streamingRate: 30,
  });

  // Cargar datos del perfil cuando se abre el modal
  useEffect(() => {
    const fetchProfile = async () => {
      if (!performer?.id) return;
      
      setLoading(true);
      try {
        const profile = await PerformerProfileService.getPerformerProfile(performer.id);
        setProfileDataFromApi(profile);
        
        // Actualizar los datos locales con los datos del backend
        setProfileData(prev => ({
          ...prev,
          nickname: profile.nickName || prev.nickname,
          headline: profile.headLines || prev.headline,
          myLive: profile.showDescription || prev.myLive,
          age: profile.age || prev.age,
          height: profile.height || prev.height,
          weight: profile.weight || prev.weight,
          country: profile.countryCode || prev.country,
          twitterLink: profile.twitterLink || prev.twitterLink,
          instagramLink: profile.instagramLink || prev.instagramLink,
        }));
      } catch (error) {
        console.error('Error loading performer profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [performer?.id]);

  // Render even when performer is null; individual fields use optional chaining

  const tabs = [
    { id: 'personal', label: 'Personal Information' },
    { id: 'profile', label: 'Profile' },
    { id: 'like', label: 'I like' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'media', label: 'Media profile' },
    { id: 'payments', label: 'Payments' },
    { id: 'sales', label: 'Sales' },
  ];

  const handleInputChange = (field: string, value: unknown) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
        <div className="relative">
          <img
            src={
              performer?.avatar_url ||
              'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
            }
            alt={performer?.stage_name ?? 'Profile'}
            className="w-24 h-24 md:w-32 md:h-32 rounded-lg object-cover"
          />
          <button className="absolute bottom-1 right-1 md:bottom-2 md:right-2 bg-pink-600 hover:bg-pink-700 p-1 md:p-2 rounded-full transition-colors">
            <Upload className="w-4 h-4 text-white" />
          </button>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            {performer?.stage_name ?? '—'}
          </h2>
          <p className="text-gray-600 text-sm md:text-base flex items-center justify-center md:justify-start gap-2">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            {performer
              ? `${(performer.rating ?? 0).toFixed(1)} • ${performer.total_shows ?? 0} shows`
              : ''}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            NickName
          </label>
          <input
            type="text"
            value={profileData.nickname}
            onChange={(e) => handleInputChange('nickname', e.target.value)}
            className="w-full bg-white border border-gray-300 text-gray-900 px-3 md:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm md:text-base"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Headline</label>
        <textarea
          value={profileData.headline}
          onChange={(e) => handleInputChange('headline', e.target.value)}
          rows={2}
          className="w-full bg-white border border-gray-300 text-gray-900 px-3 md:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm md:text-base"
        />
      </div>

      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">My live</label>
        <textarea
          value={profileData.myLive}
          onChange={(e) => handleInputChange('myLive', e.target.value)}
          rows={2}
          className="w-full bg-white border border-gray-300 text-gray-900 px-3 md:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm md:text-base"
        />
      </div>

      <div className="bg-blue-600 p-3 md:p-4 rounded-lg">
        <button className="flex items-center space-x-2 text-white">
          <LinkIcon className="w-4 h-4" />
          <span className="text-sm md:text-base">Enable your telegram</span>
        </button>
        <p className="text-xs md:text-sm text-blue-100 mt-2">
          You must have telegram on your phone, Android, iPhone. When you press the button, open the
          telegram, click start, with this register your telegram to receive notifications from
          LiveCharmss
        </p>
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Age</label>
          <div className="relative">
            <input
              type="range"
              min="18"
              max="50"
              value={profileData.age}
              onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="text-center mt-2 text-gray-900 font-medium text-sm md:text-base">
              {profileData.age} years
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Height</label>
          <div className="relative">
            <input
              type="range"
              min="150"
              max="180"
              value={profileData.height}
              onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="text-center mt-2 text-gray-900 font-medium text-sm md:text-base">
              {profileData.height} cms
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Weight</label>
          <div className="relative">
            <input
              type="range"
              min="45"
              max="80"
              value={profileData.weight}
              onChange={(e) => handleInputChange('weight', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="text-center mt-2 text-gray-900 font-medium text-sm md:text-base">
              {profileData.weight} kl
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Zodiac</label>
          <select
            value={profileData.zodiac}
            onChange={(e) => handleInputChange('zodiac', e.target.value)}
            className="w-full bg-white border border-gray-300 text-gray-900 px-3 md:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
          >
            <option value="Sagittarius">Sagittarius</option>
            <option value="Aries">Aries</option>
            <option value="Taurus">Taurus</option>
            <option value="Gemini">Gemini</option>
            <option value="Cancer">Cancer</option>
            <option value="Leo">Leo</option>
            <option value="Virgo">Virgo</option>
            <option value="Libra">Libra</option>
            <option value="Scorpio">Scorpio</option>
            <option value="Capricorn">Capricorn</option>
            <option value="Aquarius">Aquarius</option>
            <option value="Pisces">Pisces</option>
          </select>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            Ethnicity
          </label>
          <select
            value={profileData.ethnicity}
            onChange={(e) => handleInputChange('ethnicity', e.target.value)}
            className="w-full bg-white border border-gray-300 text-gray-900 px-3 md:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
          >
            <option value="White">White</option>
            <option value="Black">Black</option>
            <option value="Asian">Asian</option>
            <option value="Hispanic">Hispanic</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            Sexual Preference
          </label>
          <select
            value={profileData.sexualPreference}
            onChange={(e) => handleInputChange('sexualPreference', e.target.value)}
            className="w-full bg-white border border-gray-300 text-gray-900 px-3 md:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
          >
            <option value="Straight">Straight</option>
            <option value="Gay">Gay</option>
            <option value="Bisexual">Bisexual</option>
            <option value="Lesbian">Lesbian</option>
          </select>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            Hair Color
          </label>
          <select
            value={profileData.hairColor}
            onChange={(e) => handleInputChange('hairColor', e.target.value)}
            className="w-full bg-white border border-gray-300 text-gray-900 px-3 md:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
          >
            <option value="Brown">Brown</option>
            <option value="Black">Black</option>
            <option value="Blonde">Blonde</option>
            <option value="Red">Red</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            Eye Color
          </label>
          <select
            value={profileData.eyeColor}
            onChange={(e) => handleInputChange('eyeColor', e.target.value)}
            className="w-full bg-white border border-gray-300 text-gray-900 px-3 md:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
          >
            <option value="Green">Green</option>
            <option value="Brown">Brown</option>
            <option value="Blue">Blue</option>
            <option value="Hazel">Hazel</option>
            <option value="Gray">Gray</option>
          </select>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Build</label>
          <select
            value={profileData.build}
            onChange={(e) => handleInputChange('build', e.target.value)}
            className="w-full bg-white border border-gray-300 text-gray-900 px-3 md:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
          >
            <option value="Slender">Slender</option>
            <option value="Athletic">Athletic</option>
            <option value="Average">Average</option>
            <option value="Curvy">Curvy</option>
            <option value="Plus Size">Plus Size</option>
          </select>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            Display Country
          </label>
          <select
            value={profileData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            className="w-full bg-white border border-gray-300 text-gray-900 px-3 md:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
          >
            <option value="Colombia +57">Colombia +57</option>
            <option value="USA +1">USA +1</option>
            <option value="Mexico +52">Mexico +52</option>
            <option value="Argentina +54">Argentina +54</option>
          </select>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            TwitterLink
          </label>
          <input
            type="text"
            value={profileData.twitterLink}
            onChange={(e) => handleInputChange('twitterLink', e.target.value)}
            className="w-full bg-white border border-gray-300 text-gray-900 px-3 md:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            InstagramLink
          </label>
          <input
            type="text"
            value={profileData.instagramLink}
            onChange={(e) => handleInputChange('instagramLink', e.target.value)}
            className="w-full bg-white border border-gray-300 text-gray-900 px-3 md:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
          />
        </div>
      </div>
    </div>
  );

  const renderPricingTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            VideoCallMinute
          </label>
          <div className="relative">
            <input
              type="range"
              min="10"
              max="50"
              value={profileData.videoCallRate}
              onChange={(e) => handleInputChange('videoCallRate', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="text-center mt-2 text-gray-900 font-medium text-sm md:text-base">
              {profileData.videoCallRate} tokens - 2.7 dtrs
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            Streaming_Minute
          </label>
          <div className="relative">
            <input
              type="range"
              min="20"
              max="60"
              value={profileData.streamingRate}
              onChange={(e) => handleInputChange('streamingRate', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="text-center mt-2 text-gray-900 font-medium text-sm md:text-base">
              {profileData.streamingRate} tokens - 4.5 dtrs
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentsTab = () => {
    const weeklyData = [
      { week: 12, amount: 0.09, status: 'GENERATED' },
      { week: 11, amount: 0.09, status: 'GENERATED' },
      { week: 10, amount: 1.98, status: 'GENERATED' },
      { week: 3, amount: 0.09, status: 'GENERATED' },
      { week: 17, amount: 0.09, status: 'GENERATED' },
    ];

    const paymentMethods = [
      { name: 'Bank Transfer', fee: '2%', minPayout: '$50' },
      { name: 'PayPal', fee: '3%', minPayout: '$20' },
      { name: 'Cryptocurrency', fee: '1%', minPayout: '$10' },
      { name: 'Wire Transfer', fee: '$15', minPayout: '$100' },
    ];

    const recentTransactions = [
      { date: '2025-01-15', type: 'Private Show', amount: 45.5, status: 'Completed' },
      { date: '2025-01-14', type: 'Tips', amount: 23.75, status: 'Completed' },
      { date: '2025-01-14', type: 'Video Call', amount: 67.2, status: 'Completed' },
      { date: '2025-01-13', type: 'Gifts', amount: 12.3, status: 'Pending' },
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm">Total Earnings</p>
                <p className="text-lg md:text-xl font-bold text-gray-900">$234.50</p>
              </div>
              <div className="p-2 rounded-lg bg-green-600">
                <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm">This Week</p>
                <p className="text-lg md:text-xl font-bold text-gray-900">$67.30</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-600">
                <Calendar className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm">Pending</p>
                <p className="text-lg md:text-xl font-bold text-gray-900">$45.30</p>
              </div>
              <div className="p-2 rounded-lg bg-yellow-600">
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm">Available</p>
                <p className="text-lg md:text-xl font-bold text-gray-900">$189.20</p>
              </div>
              <div className="p-2 rounded-lg bg-purple-600">
                <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-3 md:p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm md:text-base font-semibold">Weekly Payments</h3>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <select className="bg-gray-100 text-gray-900 px-2 py-1 rounded text-xs focus:outline-none focus:ring-2 focus:ring-pink-500">
                  <option value="Semana 33, 2025">Semana 33, 2025</option>
                  <option value="Semana 32, 2025">Semana 32, 2025</option>
                  <option value="Semana 31, 2025">Semana 31, 2025</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="grid grid-cols-4 gap-2 text-xs font-medium text-gray-600 mb-2">
                  <div>Week</div>
                  <div>Amount US$</div>
                  <div>Method</div>
                  <div>Status</div>
                </div>

                {weeklyData.map((payment, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 text-xs text-gray-900 py-1">
                    <div>{payment.week}</div>
                    <div>${payment.amount.toFixed(2)}</div>
                    <div>Bank</div>
                    <div className="text-green-600">{payment.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-3 md:p-4">
            <h3 className="text-sm md:text-base font-semibold mb-4">Payment Methods</h3>
            <div className="space-y-3">
              {paymentMethods.map((method, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-gray-900 font-medium text-sm">{method.name}</div>
                      <div className="text-gray-600 text-xs">
                        Fee: {method.fee} | Min: {method.minPayout}
                      </div>
                    </div>
                    <button className="text-pink-600 hover:text-pink-700 text-xs">Configure</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-3 md:p-4">
          <h3 className="text-sm md:text-base font-semibold mb-4">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-600 border-b border-gray-200">
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Type</th>
                  <th className="text-right py-2">Amount</th>
                  <th className="text-center py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction, index) => (
                  <tr key={index} className="text-gray-900 border-b border-gray-100">
                    <td className="py-2">{transaction.date}</td>
                    <td className="py-2">{transaction.type}</td>
                    <td className="py-2 text-right">${transaction.amount.toFixed(2)}</td>
                    <td className="py-2 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          transaction.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderSalesTab = () => {
    return (
      <div className="text-center py-8 text-gray-600">
        <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg font-medium">Sales Analytics</p>
        <p className="text-sm mt-2">Detailed sales data will appear here</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20 rounded-lg">
            <div className="flex flex-col items-center">
              <div className="animate-spin h-12 w-12 border-4 border-pink-600 border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-600">Cargando perfil...</p>
            </div>
          </div>
        )}
        
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-bold text-gray-900">
              Profile Management - {performer?.stage_name ?? ''}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex overflow-x-auto scrollbar-hide border-t border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-pink-600 text-pink-600 bg-pink-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'personal' && renderPersonalInfo()}
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'pricing' && renderPricingTab()}
          {activeTab === 'payments' && renderPaymentsTab()}
          {activeTab === 'like' && (
            <div className="text-center py-8 text-gray-600">
              <p>I like section - Coming soon</p>
            </div>
          )}
          {activeTab === 'media' && (
            <div className="text-center py-8 text-gray-600">
              <p>Media profile section - Coming soon</p>
            </div>
          )}
          {activeTab === 'sales' && renderSalesTab()}
        </div>

        <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Save className="w-4 h-4" />
            <span>Save changes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
