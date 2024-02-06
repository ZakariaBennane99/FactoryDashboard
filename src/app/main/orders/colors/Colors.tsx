import ColorsComp from '../../../components/orders/colors/Colors';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';


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

function Colors() {
	
	// the examplePage's a namespace that is used in case
	// you have defined multiple pages in the i18n page wihtin 
	// this component like so:
	/*
		{
  			"examplePage": {
  			  "TITLE": "Departments"
  			},
  			"anotherPage": {
  			  "TITLE": "Employees"
  			}
		}
	*/
	const { t } = useTranslation('colorsPage');

	return (
		<Root
			header={
				<div className="p-24">
					<h1 className="text-5xl font-extrabold">{t('TITLE')}</h1>
				</div>
			}
			content={
				<div className="p-24 w-full h-full">
					<ColorsComp />
				</div>
			}
		/>
	);
}

export default Colors;
