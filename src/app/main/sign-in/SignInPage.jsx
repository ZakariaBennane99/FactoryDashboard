import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import _ from '@lodash';
import Paper from '@mui/material/Paper';
import { useEffect } from 'react';
import jwtService from '../../auth/services/jwtService';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	email: yup.string().email('You must enter a valid email').required('You must enter a email'),
	password: yup
		.string()
		.required('Please enter your password.')
		.min(4, 'Password is too short - must be at least 4 chars.'),
	remember: yup.boolean()
});

const defaultValues = {
	email: '',
	password: '',
	remember: true
};

/**
 * The sign in page.
 */
function SignInPage() {
	const { control, formState, handleSubmit, setError, setValue } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	useEffect(() => {
		setValue('email', 'admin@fusetheme.com', { shouldDirty: true, shouldValidate: true });
		setValue('password', 'admin', { shouldDirty: true, shouldValidate: true });
	}, [setValue]);

	function onSubmit({ email, password }) {
		jwtService
			.signInWithEmailAndPassword(email, password)
			.then((user) => {
				// eslint-disable-next-line no-console
				console.info(user);

				// No need to do anything, user data will be set at app/auth/AuthContext
			})
			.catch((errors) => {
				console.log('THE ERRORS', errors)
				errors.forEach((error) => {
					setError(error.type, {
						type: 'manual',
						message: error.message
					});
				});
			});
	}

	return (
		<Paper style={{ 
				width: '100%',
				height: '100%',
				display: 'flex',
				justifyContent: 'center', 
				alignItems: 'center'
			 }}>
				<div className="w-full max-w-320 sm:mx-0 sm:w-320">
					<img
						style={{ width: '80px' }}
						src="assets/images/logo/home-logo.png"
						alt="logo"
					/>

					<Typography className="mt-32 text-4xl font-extrabold leading-tight tracking-tight">
						Sign in
					</Typography>

					<form
						name="loginForm"
						noValidate
						className="mt-32 flex w-full flex-col justify-center"
						onSubmit={handleSubmit(onSubmit)}
					>
						<Controller
							name="email"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-24"
									label="Email"
									autoFocus
									type="email"
									error={!!errors.email}
									helperText={errors?.email?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>

						<Controller
							name="password"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-24"
									label="Password"
									type="password"
									error={!!errors.password}
									helperText={errors?.password?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>

						<div className="flex flex-col items-center justify-center sm:flex-row sm:justify-between">
							<Controller
								name="remember"
								control={control}
								render={({ field }) => (
									<FormControl>
										<FormControlLabel
											label="Remember me"
											control={
												<Checkbox
													size="small"
													{...field}
												/>
											}
										/>
									</FormControl>
								)}
							/>

							<Link
								className="text-md font-medium"
								to="/pages/auth/forgot-password"
							>
								Forgot password?
							</Link>
						</div>

						<Button
							variant="contained"
							color="secondary"
							className=" mt-16 w-full"
							aria-label="Sign in"
							style={{ borderRadius: '6px' }}
							disabled={_.isEmpty(dirtyFields) || !isValid}
							type="submit"
							size="large"
						>
							Sign in
						</Button>
					</form>
				</div>
			</Paper>
	);
}

export default SignInPage;
