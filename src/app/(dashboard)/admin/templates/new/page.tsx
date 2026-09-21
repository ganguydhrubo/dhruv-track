'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

interface Question {
  id: string;
  text: string;
  category: string;
  required: boolean;
  allow_photo: boolean;
  allow_comment: boolean;
}

export default function NewTemplatePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('SAFETY');
  const [divisionType, setDivisionType] = useState('RETAIL');
  const [questions, setQuestions] = useState<Question[]>([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: uuidv4(),
        text: '',
        category: 'GENERAL',
        required: true,
        allow_photo: true,
        allow_comment: true
      }
    ]);
  };

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving template:', { name, category, division_type: divisionType, questions });
    router.push('/admin/templates');
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Template Builder</h1>
        <Button onClick={handleSave} disabled={!name || questions.length === 0}>Save Template</Button>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Template Name</label>
            <input 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Monthly Fire Safety"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="SAFETY">Safety</option>
              <option value="QUALITY">Quality</option>
              <option value="AUDIT">Audit</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Division Type</label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={divisionType}
              onChange={e => setDivisionType(e.target.value)}
            >
              <option value="RETAIL">Retail</option>
              <option value="LPG">LPG</option>
              <option value="AVIATION">Aviation</option>
              <option value="LUBES">Lubes</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Questions ({questions.length})</h2>
            <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
              <Plus className="w-4 h-4 mr-2" /> Add Question
            </Button>
          </div>

          {questions.length === 0 ? (
            <div className="p-8 text-center border border-dashed rounded-lg bg-muted/20 text-muted-foreground">
              No questions added yet. Click 'Add Question' to start building your template.
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((q, index) => (
                <div key={q.id} className="flex gap-4 p-4 rounded-xl border bg-card shadow-sm items-start">
                  <div className="mt-2 cursor-move text-muted-foreground"><GripVertical className="w-5 h-5" /></div>
                  <div className="flex-1 space-y-4">
                    <div className="flex gap-2">
                      <span className="font-semibold text-lg">{index + 1}.</span>
                      <input 
                        className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={q.text}
                        onChange={e => updateQuestion(q.id, 'text', e.target.value)}
                        placeholder="Question text..."
                        required
                      />
                    </div>
                    <div className="flex flex-wrap gap-4 ml-6">
                      <label className="flex items-center space-x-2 text-sm">
                        <input type="checkbox" checked={q.required} onChange={e => updateQuestion(q.id, 'required', e.target.checked)} className="rounded border-gray-300" />
                        <span>Required</span>
                      </label>
                      <label className="flex items-center space-x-2 text-sm">
                        <input type="checkbox" checked={q.allow_photo} onChange={e => updateQuestion(q.id, 'allow_photo', e.target.checked)} className="rounded border-gray-300" />
                        <span>Allow Photo</span>
                      </label>
                      <label className="flex items-center space-x-2 text-sm">
                        <input type="checkbox" checked={q.allow_comment} onChange={e => updateQuestion(q.id, 'allow_comment', e.target.checked)} className="rounded border-gray-300" />
                        <span>Allow Comment</span>
                      </label>
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => removeQuestion(q.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
