import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import Button from '@/components/atoms/Button';
import { Meeting, UpdateMeetingInput } from '@/types';

interface Props {
  meeting: Meeting;
  onSave: (data: UpdateMeetingInput) => Promise<void>;
  loading?: boolean;
}

export default function EditMeetingForm({ meeting, onSave, loading = false }: Props) {
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<UpdateMeetingInput>();

  useEffect(() => {
    reset({
      title: meeting.title,
      dateTime: format(new Date(meeting.dateTime), "yyyy-MM-dd'T'HH:mm"),
      description: meeting.description || '',
    });
  }, [meeting, reset]);

  return (
    <form onSubmit={handleSubmit(onSave)} className="flex flex-col gap-4" noValidate>
      <Input
        label="Title"
        required
        error={errors.title?.message}
        {...register('title', { required: 'Title is required', minLength: { value: 2, message: 'Min 2 characters' } })}
      />
      <Input
        label="Date & Time"
        type="datetime-local"
        required
        error={errors.dateTime?.message}
        {...register('dateTime', { required: 'Date and time are required' })}
      />
      <Textarea
        label="Description"
        placeholder="Optional — agenda, goals, context"
        {...register('description')}
      />
      <div className="flex justify-end">
        <Button type="submit" size="sm" loading={loading} disabled={!isDirty}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}
