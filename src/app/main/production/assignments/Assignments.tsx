import AssignmentComp from '../../../components/production/assignments/Assignment'
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

function Assignment() {
	
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
	const { t } = useTranslation('assignmentsPage');

	return (
		<Root
			header={
				<div className="p-24">
					<h4 className="text-5xl font-extrabold">{t('TITLE')}</h4>
				</div>
			}
			content={
				<div className="p-24 w-full h-full" style={{ overflowY: "hidden" }}>
					<AssignmentComp />
				</div>
			}
		/>
	);
}

export default Assignment;
