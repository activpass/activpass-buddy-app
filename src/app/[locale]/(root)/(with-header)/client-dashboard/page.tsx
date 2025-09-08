'use client';

import { dateIntl } from '@paalan/react-shared/lib';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Center,
  Grid,
  Heading,
  Progress,
  SkeletonContainer,
  Text,
  VStack,
} from '@paalan/react-ui';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { type FC, useEffect, useState } from 'react';
import {
  FaCalendarAlt as CalendarIcon,
  FaChartLine as TrendingUpIcon,
  FaClock as ClockIcon,
  FaCreditCard as CreditCardIcon,
  FaHeart as HeartIcon,
  FaStar as StarIcon,
  FaUser as UserIcon,
  FaUsers as UsersIcon,
} from 'react-icons/fa';

import { api } from '@/trpc/client';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const ClientDashboard: FC = () => {
  const searchParams = useSearchParams();

  const clientId = searchParams.get('clientId') || '';
  const organizationId = searchParams.get('organizationId') || '';

  const [greeting, setGreeting] = useState('');

  // Fetch real data from API
  const {
    data: dashboardData,
    isLoading,
    error,
  } = api.clientDashboard.get.useQuery(
    { clientId, organizationId },
    {
      enabled: !!(clientId && organizationId),
      retry: 2,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <Center className="h-full p-4">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="text-center">
            <Heading as="h1" className="text-4xl font-bold">
              Loading your dashboard...
            </Heading>
            <Text className="mt-2 text-lg text-muted-foreground">
              Please wait while we fetch your data
            </Text>
          </div>
          <SkeletonContainer
            count={3}
            containerClassName="space-y-0 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
            className="h-32 w-full rounded-lg"
          />
        </div>
      </Center>
    );
  }

  // Show error state
  if (error || !dashboardData) {
    return (
      <Center className="h-full p-4">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="text-center">
            <Heading as="h1" className="text-4xl font-bold text-red-600">
              Error Loading Dashboard
            </Heading>
            <Text className="mt-2 text-lg text-muted-foreground">
              {error?.message ||
                'Unable to load your dashboard data. Please check your client ID and organization ID.'}
            </Text>
            {!clientId || !organizationId ? (
              <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <Text className="text-sm text-yellow-800">
                  <strong>Missing Required Parameters:</strong>
                  <br />
                  This page requires both <code>clientId</code> and <code>organizationId</code> URL
                  parameters.
                  <br />
                  Example: <code>/client-dashboard?clientId=123&organizationId=456</code>
                </Text>
              </div>
            ) : null}
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </Center>
    );
  }

  const {
    client,
    organization,
    membershipPlan,
    fitnessStats,
    membershipStatus,
    achievements,
    upcomingClasses,
  } = dashboardData;

  const progressPercentage = (
    (fitnessStats.totalWorkouts / fitnessStats.monthlyGoal) *
    100
  ).toFixed(0);
  const membershipProgress =
    ((membershipStatus.totalDays - membershipStatus.daysRemaining) / membershipStatus.totalDays) *
    100;

  const quickActions = [
    {
      title: 'Book a Class',
      description: 'Reserve your spot',
      icon: CalendarIcon,
      color: 'bg-blue-500',
      href: '/book-class',
    },
    {
      title: 'Track Workout',
      description: 'Log your session',
      icon: TrendingUpIcon,
      color: 'bg-green-500',
      href: '/track-workout',
    },
    {
      title: 'View Profile',
      description: 'Update your info',
      icon: UserIcon,
      color: 'bg-purple-500',
      href: '/profile',
    },
    {
      title: 'Payment History',
      description: 'Billing details',
      icon: CreditCardIcon,
      color: 'bg-orange-500',
      href: '/billing',
    },
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerChildren}
      className="h-full p-4"
    >
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header Section */}
        <motion.div variants={fadeInUp} className="text-center">
          <Heading
            as="h1"
            className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent"
          >
            {greeting}, {client.firstName}! 👋
          </Heading>
          <Text className="mt-2 text-lg text-muted-foreground">
            Welcome to <strong>{organization.name}</strong> - Ready to crush your fitness goals
            today?
          </Text>
        </motion.div>

        {/* Quick Stats Overview */}
        <motion.div variants={fadeInUp}>
          <Grid className="grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-blue-500 p-3">
                    <TrendingUpIcon className="size-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <Text className="text-sm font-medium text-muted-foreground">This Month</Text>
                    <Text className="text-2xl font-bold">{fitnessStats.totalWorkouts}</Text>
                    <Text className="text-xs text-muted-foreground">Workouts</Text>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-green-500 p-3">
                    <HeartIcon className="size-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <Text className="text-sm font-medium text-muted-foreground">Streak</Text>
                    <Text className="text-2xl font-bold">{fitnessStats.streak}</Text>
                    <Text className="text-xs text-muted-foreground">Days</Text>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-purple-500 p-3">
                    <ClockIcon className="size-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <Text className="text-sm font-medium text-muted-foreground">Avg Session</Text>
                    <Text className="text-2xl font-bold">{fitnessStats.avgDuration}</Text>
                    <Text className="text-xs text-muted-foreground">Minutes</Text>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-orange-500 p-3">
                    <StarIcon className="size-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <Text className="text-sm font-medium text-muted-foreground">Calories</Text>
                    <Text className="text-2xl font-bold">
                      {fitnessStats.calories.toLocaleString()}
                    </Text>
                    <Text className="text-xs text-muted-foreground">Burned</Text>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </motion.div>

        <Grid className="grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Monthly Progress */}
            <motion.div variants={fadeInUp}>
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <CardTitle className="flex items-center">
                    <TrendingUpIcon className="mr-2 size-5" />
                    Monthly Progress
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    You're {progressPercentage}% towards your monthly goal!
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Workouts Completed</span>
                      <span className="font-medium">
                        {fitnessStats.totalWorkouts}/{fitnessStats.monthlyGoal}
                      </span>
                    </div>
                    <Progress value={Number(progressPercentage)} className="h-3" />
                    <Text className="text-sm text-muted-foreground">
                      {fitnessStats.monthlyGoal - fitnessStats.totalWorkouts} more workouts to reach
                      your goal!
                    </Text>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Upcoming Classes */}
            <motion.div variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarIcon className="mr-2 size-5 text-blue-600" />
                    Upcoming Classes
                  </CardTitle>
                  <CardDescription>Your scheduled sessions this week</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {upcomingClasses.map((classItem, index) => (
                      <motion.div
                        key={classItem.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group rounded-lg border p-4 transition-all hover:bg-accent/50 hover:shadow-md"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500">
                                <Text className="text-sm font-semibold text-white">
                                  {classItem.name
                                    .split(' ')
                                    .map(word => word[0])
                                    .join('')}
                                </Text>
                              </div>
                              <div>
                                <Text className="font-semibold">{classItem.name}</Text>
                                <Text className="text-sm text-muted-foreground">
                                  with {classItem.instructor}
                                </Text>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Text className="font-medium">{classItem.time}</Text>
                            <Text className="text-sm text-muted-foreground">{classItem.date}</Text>
                            <div className="mt-1 flex items-center">
                              <UsersIcon className="mr-1 size-3 text-muted-foreground" />
                              <Text className="text-xs text-muted-foreground">
                                {classItem.spots} spots left
                              </Text>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <Button asChild className="mt-4 w-full">
                    <Link href="/classes">View All Classes</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks to get you started</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <Grid className="grid-cols-2 gap-4">
                    {quickActions.map((action, index) => {
                      const Icon = action.icon;
                      return (
                        <motion.div
                          key={action.title}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            asChild
                            variant="outline"
                            className="h-24 w-full flex-col space-y-2 transition-all hover:shadow-lg"
                          >
                            <Link href={action.href}>
                              <div className={`rounded-full p-2 ${action.color}`}>
                                <Icon className="size-5 text-white" />
                              </div>
                              <div className="text-center">
                                <Text className="text-sm font-medium">{action.title}</Text>
                                <Text className="text-xs text-muted-foreground">
                                  {action.description}
                                </Text>
                              </div>
                            </Link>
                          </Button>
                        </motion.div>
                      );
                    })}
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Membership Status */}
            <motion.div variants={fadeInUp}>
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                  <CardTitle className="flex items-center">
                    <CreditCardIcon className="mr-2 size-5" />
                    Membership Status
                  </CardTitle>
                  <Badge className="w-fit bg-white text-green-600">{membershipStatus.status}</Badge>
                </CardHeader>
                <CardContent className="p-6">
                  <VStack gap="4">
                    <div className="text-center">
                      <Text className="text-3xl font-bold text-green-600">
                        {membershipStatus.daysRemaining}
                      </Text>
                      <Text className="text-sm text-muted-foreground">Days Remaining</Text>
                    </div>

                    <Progress value={membershipProgress} className="h-2" />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Plan:</span>
                        <span className="font-medium">{membershipPlan.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Price:</span>
                        <span className="font-medium">
                          ${membershipPlan.price}/{membershipPlan.tenureType.slice(0, -1)}
                        </span>
                      </div>
                      {membershipStatus.nextPayment && (
                        <div className="flex justify-between text-sm">
                          <span>Next Payment:</span>
                          <span className="font-medium">
                            {dateIntl.format(new Date(membershipStatus.nextPayment), {
                              dateFormat: 'MMM dd, yyyy',
                            })}
                          </span>
                        </div>
                      )}
                    </div>

                    <Button variant="outline" className="w-full">
                      Manage Subscription
                    </Button>
                  </VStack>
                </CardContent>
              </Card>
            </motion.div>

            {/* Achievements */}
            <motion.div variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <StarIcon className="mr-2 size-5 text-yellow-500" />
                    Achievements
                  </CardTitle>
                  <CardDescription>Your fitness milestones</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {achievements.map((achievement, index) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center space-x-3 rounded-lg p-3 transition-all ${
                          achievement.earned
                            ? 'border border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20'
                            : 'bg-gray-50 opacity-60 dark:bg-gray-800/50'
                        }`}
                      >
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <Text
                            className={`font-medium ${achievement.earned ? 'text-foreground' : 'text-muted-foreground'}`}
                          >
                            {achievement.title}
                          </Text>
                          {achievement.earned && (
                            <Text className="text-xs font-medium text-green-600">
                              Unlocked
                              {achievement.earnedDate
                                ? ` on ${dateIntl.format(new Date(achievement.earnedDate), { dateFormat: 'MMM dd' })}`
                                : ''}
                              !
                            </Text>
                          )}
                        </div>
                        {achievement.earned && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            ✓
                          </Badge>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  <Button variant="ghost" className="mt-4 w-full">
                    View All Achievements
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Today's Motivation */}
            <motion.div variants={fadeInUp}>
              <Card className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 text-4xl">💪</div>
                  <Text className="mb-2 text-lg font-semibold">Daily Motivation</Text>
                  <Text className="italic text-purple-100">
                    "The only bad workout is the one that didn't happen. You've got this!"
                  </Text>
                  <Button
                    variant="solid"
                    color="secondary"
                    className="mt-4 bg-white text-purple-600 hover:bg-purple-50"
                  >
                    Start Today's Workout
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </Grid>

        {/* Footer */}
        <motion.div variants={fadeInUp} className="py-8 text-center">
          <Text className="text-muted-foreground">
            Keep pushing your limits! Every workout counts towards your fitness journey. 🚀
          </Text>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ClientDashboard;
