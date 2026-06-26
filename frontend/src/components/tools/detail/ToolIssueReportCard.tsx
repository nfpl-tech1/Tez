import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertMessage } from '@/components/ui/alert';
import { AlertTriangle, Send, CheckCircle } from 'lucide-react';
import { publicApi } from '@/lib/api';

interface ToolIssueReportCardProps {
    toolId: number;
}

export function ToolIssueReportCard({ toolId }: ToolIssueReportCardProps) {
    const [showIssueForm, setShowIssueForm] = useState(false);
    const [submittingIssue, setSubmittingIssue] = useState(false);
    const [issueSuccess, setIssueSuccess] = useState(false);
    const [issueError, setIssueError] = useState('');
    const [issueForm, setIssueForm] = useState({
        name: '',
        email: '',
        description: '',
    });

    const handleSubmitIssue = async (e: FormEvent) => {
        e.preventDefault();
        setIssueError('');
        setSubmittingIssue(true);

        try {
            await publicApi.reportIssue(toolId, issueForm);
            setIssueSuccess(true);
            setIssueForm({ name: '', email: '', description: '' });
            setTimeout(() => {
                setShowIssueForm(false);
                setIssueSuccess(false);
            }, 3000);
        } catch (err: any) {
            setIssueError(err.response?.data?.detail || 'Failed to submit issue');
        } finally {
            setSubmittingIssue(false);
        }
    };

    return (
        <Card>
            <CardHeader className="border-b border-[hsl(var(--border))]">
                <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Report an Issue
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                {!showIssueForm ? (
                    <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                        <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="h-6 w-6 text-amber-600" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium">Found a bug or problem?</p>
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                Let the developer know so they can fix it
                            </p>
                        </div>
                        <Button variant="outline" onClick={() => setShowIssueForm(true)}>
                            Report Issue
                        </Button>
                    </div>
                ) : issueSuccess ? (
                    <div className="text-center py-8">
                        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <p className="font-semibold text-lg text-green-700">Issue Reported Successfully!</p>
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">
                            The tool uploader has been notified.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmitIssue} className="space-y-4">
                        {issueError && <AlertMessage variant="destructive" message={issueError} onDismiss={() => setIssueError('')} />}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="issueName">Your Name *</Label>
                                <Input
                                    id="issueName"
                                    value={issueForm.name}
                                    onChange={(e) => setIssueForm({ ...issueForm, name: e.target.value })}
                                    placeholder="John Doe"
                                    required
                                    className="h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="issueEmail">Your Email *</Label>
                                <Input
                                    id="issueEmail"
                                    type="email"
                                    value={issueForm.email}
                                    onChange={(e) => setIssueForm({ ...issueForm, email: e.target.value })}
                                    placeholder="john@example.com"
                                    required
                                    className="h-12"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="issueDescription">Describe the Issue *</Label>
                            <Textarea
                                id="issueDescription"
                                value={issueForm.description}
                                onChange={(e) => setIssueForm({ ...issueForm, description: e.target.value })}
                                placeholder="Please describe what happened, steps to reproduce, expected behavior, etc."
                                rows={5}
                                required
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button type="submit" disabled={submittingIssue} className="h-12">
                                {submittingIssue ? (
                                    <span className="flex items-center">
                                        <span className="h-4 w-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Submitting...
                                    </span>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4 mr-2" />
                                        Submit Issue
                                    </>
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    setShowIssueForm(false);
                                    setIssueError('');
                                }}
                                className="h-12"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}
