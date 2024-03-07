import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { selectUser } from 'app/store/user/userSlice';
import { useTranslation } from 'react-i18next';

/**
 * The user menu.
 */
function UserMenu() {

	const { i18n } = useTranslation();
    const lang = i18n.language;

	
	const user = useSelector(selectUser);

	const rolesLang = {
		CUTTING: 'القطع',
		TAILORING: 'الخياطة',
		PRINTING: 'الطباعة',
		QUALITYASSURANCE: 'ضمان الجودة',
		ENGINEERING: 'الهندسة',
		FACTORYMANAGER: 'مدير المصنع',
		WAREHOUSEMANAGER: 'مدير المستودع'
	}

	const userRoleFormatted = lang === 'ar' ? rolesLang[`${user.userRole}`] : user.userRole;

	const [userMenu, setUserMenu] = useState<HTMLElement | null>(null);

	const userMenuClick = (event: React.MouseEvent<HTMLElement>) => {
		setUserMenu(event.currentTarget);
	};

	const userMenuClose = () => {
		setUserMenu(null);
	};


	return (
		<>
			<Button
				className="min-h-40 min-w-40 p-0 md:px-16 md:py-6"
				onClick={userMenuClick}
				color="inherit"
			>
				{
					lang === 'ar' ?
                    <>
					{user.userImage ? (
						<Avatar
							className="md:mx-4"
							alt="user photo"
							src={`http://localhost:3002${user.userImage}`}
						/>
					) : (
						<Avatar className="md:mx-4">{user.name}</Avatar>
					)}

					<div className="mx-4 hidden flex-col items-start md:flex">
						<Typography
							component="span"
							className="flex font-semibold"
						>
							{user.name}
						</Typography>
						<Typography
							className="text-11 font-medium capitalize"
							color="text.secondary"
						>
							{userRoleFormatted}
							{(!user.role || (Array.isArray(user.role) && user.role.length === 0)) && 'Guest'}
						</Typography>
					</div>
					</>
					:
				<>	
					<div className="mx-4 hidden flex-col items-end md:flex">
					<Typography
						component="span"
						className="flex font-semibold"
					>
						{user.name}
					</Typography>
					<Typography
						className="text-11 font-medium capitalize"
						color="text.secondary"
					>
						{userRoleFormatted}
						{(!user.role || (Array.isArray(user.role) && user.role.length === 0)) && 'Guest'}
					</Typography>
				</div>

				{user.userImage ? (
					<Avatar
						className="md:mx-4"
						alt="user photo"
						src={`http://localhost:3002${user.userImage}`}
					/>
				) : (
					<Avatar className="md:mx-4">{user.name}</Avatar>
				)}
				</>
				}

			</Button>

			<Popover
				open={Boolean(userMenu)}
				anchorEl={userMenu}
				onClose={userMenuClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center'
				}}
				classes={{
					paper: 'py-8'
				}}
			>
				{!user.role || user.role.length === 0 ? (
					<>
						<MenuItem
							component={Link}
							to="/sign-in"
							role="button"
						>
							<ListItemIcon className="min-w-40">
								<FuseSvgIcon>heroicons-outline:lock-closed</FuseSvgIcon>
							</ListItemIcon>
							<ListItemText primary="Sign In" />
						</MenuItem>
						<MenuItem
							component={Link}
							to="/sign-up"
							role="button"
						>
							<ListItemIcon className="min-w-40">
								<FuseSvgIcon>heroicons-outline:user-add </FuseSvgIcon>
							</ListItemIcon>
							<ListItemText primary="Sign up" />
						</MenuItem>
					</>
				) : (
					<>
						<MenuItem
							component={NavLink}
							to="/profile"
							onClick={userMenuClose}
						>
							<ListItemIcon className="min-w-40">
								<FuseSvgIcon>heroicons-outline:user-circle</FuseSvgIcon>
							</ListItemIcon>
							<ListItemText primary={lang === 'ar' ? "الملف الشخصي" : 'Profile'} />
						</MenuItem>
						<MenuItem
							component={NavLink}
							to="/sign-out"
							onClick={() => {
								userMenuClose();
							}}
						>
							<ListItemIcon className="min-w-40">
								<FuseSvgIcon>heroicons-outline:logout</FuseSvgIcon>
							</ListItemIcon>
							<ListItemText primary={lang === 'ar' ? "تسجيل الخروج" : 'Sign out'} />
						</MenuItem>
					</>	
				)}
			</Popover>
		</>
	);
}

export default UserMenu;
