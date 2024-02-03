//import DetailsComp from '../../../components/stores/details/Details';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import i18next from 'i18next';
import en from './i18n/en';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'detailsPage', en);
i18next.addResourceBundle('ar', 'detailsPage', ar);

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.palette.divider
	},
	'& .FusePageSimple-content': {},
	'& .FusePageSimple-sidebarHeader': {},
	'& .FusePageSimple-sidebarContent': {}
}));

function Details() {
	const { t } = useTranslation('detailsPage');

	return (
		<Root
			header={
				<div className="p-24">
					<h1 className="text-5xl font-extrabold">{t('TITLE')}</h1>
				</div>
			}
			content={
				<div className="p-24 w-full h-full">
					Deatils
				</div>
			}
		/>
	);
}

export default Details;
