import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function FormField({ label, error, ...props }: any) {
    return (
        <div>
            <InputLabel value={label} />
            <TextInput {...props} className="mt-1 block w-full" />
            <InputError message={error} className="mt-1" />
        </div>
    );
}
