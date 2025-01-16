import { Form } from 'react-router';
import { Input } from '../ui/input';

export default function SearchForm() {
  return (
    <div className="flex flex-col gap-4">
      <Form action="/search">
        <Input
          type="text"
          placeholder="Search restaurant, menu, food etc."
          className="rounded-2xl placeholder:text-xs border-gray-300"
          name="q"
        />
      </Form>
    </div>
  );
}
