import { z } from "zod";
import { useForm } from "react-hook-form";

const userSchema = z.object({
  name: z.string().min(1).max(255),
});

type UserSchema = z.infer<typeof userSchema>;

export default function Create() {
  const { register } = useForm<UserSchema>();

  return (
    <form>
      <input type="text" {...register("name")} />
      <button type="submit">생성</button>
    </form>
  );
}
