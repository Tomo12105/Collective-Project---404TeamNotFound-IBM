import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Modal from '@/components/molecules/Modal';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import Button from '@/components/atoms/Button';
import { useMeetings } from '@/hooks/useMeetings';
import { CreateMeetingInput } from '@/types';
import toast from 'react-hot-toast';


interface Props { open: boolean; onClose: () => void; }


export default function CreateMeetingModal({ open, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const { createMeeting }     = useMeetings();
  const navigate              = useNavigate();


  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<CreateMeetingInput>({
      mode: 'onSubmit',
      reValidateMode: 'onSubmit',
    });


  const onSubmit = async (data: CreateMeetingInput) => {
    setLoading(true);
    try {
      const meeting = await createMeeting(data);
      toast.success('Meeting created');
      reset();
      onClose();
      navigate(`/meetings/${meeting.id}`);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Modal open={open} onClose={onClose} title="New Meeting">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <Input
          label="Title"
          required
          error={errors.title?.message}
          {...register('title', { required: 'Title is required', minLength: { value: 2, message: 'Min 2 characters' } })}
        />
        <Textarea
          label="Transcript"
          required
          rows={8}
          placeholder="Paste the meeting transcript here…"
          error={errors.transcript?.message}
          {...register('transcript', { required: 'Transcript is required' })}
        />
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>Create Meeting</Button>
        </div>
      </form>
    </Modal>
  );
}