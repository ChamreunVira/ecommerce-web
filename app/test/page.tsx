"use client";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from "zod";

const loginSchema = z.object({
    email: z.email("Please enter a valid emai."),
    password: z.string().min(8, "Password must be at least 8 characters.")
});

type LoginForm = z.infer<typeof loginSchema>;


const page = () => {

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const handleRegister = (data: LoginForm) => {
        console.log(data)
    }

    return (
        <div>
            <form action="" onSubmit={handleSubmit(handleRegister)}>
                
                <div>
                    <input type="text" className='form-control' {...register("email")} placeholder='Email...' />
                    <p className='text-rose-500'>{errors.email ? errors.email.message : ''}</p>
                </div>
                
                <div>
                    <input type="text" className='form-control' {...register("password")} placeholder='Password...' />
                    <p className='text-rose-500'>{errors.password ? errors.password.message : ''}</p>
                </div>

                <button className='btn btn-primary' type='submit'>Register</button>
            </form>
        </div>
    )
}

export default page