
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, KeyRound, MessageSquare, ShieldCheck, CheckCircle } from 'lucide-react';
import { sendOtpViaWhatsApp, verifyOtp } from '@/ai/flows/whatsapp-agent';

const PhoneSchema = z.object({
  phone: z.string().min(8, 'Please enter a valid phone number with country code.'),
});
type PhoneValues = z.infer<typeof PhoneSchema>;

const OtpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits.'),
});
type OtpValues = z.infer<typeof OtpSchema>;

export default function AmeenPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phone, setPhone] = useState('');
  const { toast } = useToast();

  const phoneForm = useForm<PhoneValues>({
    resolver: zodResolver(PhoneSchema),
    defaultValues: { phone: '968' } // Default to Oman country code
  });

  const otpForm = useForm<OtpValues>({
    resolver: zodResolver(OtpSchema),
  });

  const handleSendOtp: SubmitHandler<PhoneValues> = async (data) => {
    setIsLoading(true);
    try {
      await sendOtpViaWhatsApp({ phone: data.phone });
      setPhone(data.phone);
      setIsOtpSent(true);
      toast({ title: "OTP Sent!", description: "Please check your WhatsApp for the verification code." });
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      toast({ title: 'Error', description: error.message || 'Failed to send OTP.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp: SubmitHandler<OtpValues> = async (data) => {
    setIsVerifying(true);
    try {
      const result = await verifyOtp({ phone, otp: data.otp });
      // In a real app, you would use this token with Firebase client SDK to sign in.
      // e.g., await signInWithCustomToken(auth, result.token);
      console.log("Firebase Auth Token:", result.token);
      setIsLoggedIn(true);
      toast({ title: 'Login Successful!', description: 'You have been securely logged in.' });
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      toast({ title: 'Error', description: error.message || 'Failed to verify OTP.', variant: 'destructive' });
    } finally {
      setIsVerifying(false);
    }
  };
  
  if (isLoggedIn) {
      return (
          <div className="bg-background min-h-[calc(100vh-8rem)] flex items-center">
            <div className="container mx-auto px-4">
                 <div className="max-w-md mx-auto">
                    <Card>
                        <CardContent className="p-10 text-center">
                            <div className="flex flex-col items-center gap-6">
                                <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-full">
                                    <CheckCircle className="h-12 w-12 text-green-500" />
                                </div>
                                <div className="space-y-2">
                                    <CardTitle className="text-2xl">Login Successful</CardTitle>
                                    <CardDescription>
                                        Welcome back! You have been securely authenticated with Ameen.
                                    </CardDescription>
                                </div>
                                <Button onClick={() => { setIsLoggedIn(false); setIsOtpSent(false); phoneForm.reset(); otpForm.reset(); }}>Log Out</Button>
                            </div>
                        </CardContent>
                    </Card>
                 </div>
            </div>
         </div>
      )
  }

  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Ameen Digital Identity</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Secure, password-free login using your WhatsApp account.
          </p>
        </div>
        <div className="max-w-md mx-auto mt-12">
            <Card>
                 <CardHeader>
                    <CardTitle>{isOtpSent ? "Verify Your Identity" : "Login with WhatsApp"}</CardTitle>
                    <CardDescription>
                         {isOtpSent 
                            ? `Enter the 6-digit code sent to ${phone}.`
                            : "Enter your phone number to receive a one-time password (OTP) on WhatsApp."
                         }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!isOtpSent ? (
                        <Form {...phoneForm}>
                            <form onSubmit={phoneForm.handleSubmit(handleSendOtp)} className="space-y-6">
                                <FormField
                                    control={phoneForm.control}
                                    name="phone"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                        <Input placeholder="e.g., 96899123456" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending OTP...
                                    </>
                                    ) : (
                                    <>
                                        <MessageSquare className="mr-2 h-4 w-4" />
                                        Send OTP
                                    </>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    ) : (
                        <Form {...otpForm}>
                            <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="space-y-6">
                                <FormField
                                    control={otpForm.control}
                                    name="otp"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>One-Time Password (OTP)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter 6-digit code" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={isVerifying} className="w-full">
                                    {isVerifying ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Verifying...
                                    </>
                                    ) : (
                                    <>
                                        <KeyRound className="mr-2 h-4 w-4" />
                                        Verify & Login
                                    </>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    )}
                </CardContent>
                {isOtpSent && (
                    <CardFooter className="flex justify-center">
                        <Button variant="link" onClick={() => setIsOtpSent(false)}>Use a different number</Button>
                    </CardFooter>
                )}
            </Card>
        </div>
      </div>
    </div>
  );
}
