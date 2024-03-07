import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as yup from 'yup';
import _ from '@lodash';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import jwtService from '../../auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';




/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	userName: yup.string().required('You must enter a userName'),
	password: yup
		.string()
		.required('Please enter your password.')
		.min(4, 'Password is too short - must be at least 4 chars.')
});

const defaultValues = {
	userName: '',
	password: '',
	remember: true
};

/**
 * The sign in page.
 */
function SignInPage() {
	
	const dispatch = useAppDispatch()

	function showMsg(msg, status) {

	
		setTimeout(()=> dispatch(
			showMessage({
				message: msg, // text or html
				autoHideDuration: 3000, // ms
				anchorOrigin: {
					vertical  : 'top', // top bottom
					horizontal: 'center' // left center right
				},
				variant: status // success error info warning null
		})), 100);
	}

	const [isLoading, setIsLoading] = useState(false)

	const { control, formState, handleSubmit, setError, setValue } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	useEffect(() => {
		setValue('userName', 'zakaria.bennane', { shouldDirty: true, shouldValidate: true });
		setValue('password', 'zakaria.bennane.19', { shouldDirty: true, shouldValidate: true });
	}, [setValue]);

	function onSubmit({ userName, password }) {
		setIsLoading(true)
		jwtService
			.signInWithEmailAndPassword(userName, password)
			.then((user) => {
				// eslint-disable-next-line no-console
				console.info(user);
				// No need to do anything, user data will be set at app/auth/AuthContext
			})
			.catch((errors) => {
				console.log('The error', errors)
				const status = errors.response.status
				const msg = status === 401 ? 'Invalid credentials!' : 'Server error'
				showMsg(msg, 'error')
			}).finally(() => {
				setIsLoading(false)
			})
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
							name="userName"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-24"
									label="User Name"
									autoFocus
									type="userName"
									error={!!errors.userName}
									helperText={errors?.userName?.message}
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

						<Button
							variant="contained"
							color="secondary"
							className=" mt-16 w-full"
							aria-label="Sign in"
							style={{ 
								borderRadius: '6px',
								backgroundColor: (_.isEmpty(dirtyFields) || !isValid || isLoading) ? '#BDBDBD' : '', 
								cursor: isLoading ? 'not-allowed' : 'pointer'
							}}
							disabled={_.isEmpty(dirtyFields) || !isValid}
							type="submit"
							size="large"
						>
							{isLoading ? 'Signing you in...' : 'Sign in'}
						</Button>
					</form>
				</div>
			</Paper>
	);
}

export default SignInPage;
