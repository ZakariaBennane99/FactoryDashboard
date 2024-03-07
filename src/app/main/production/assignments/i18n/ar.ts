const locale = {
    TITLE: 'المهام',
    searchTasks: 'بحث عن المهام',
    queryLongerThan3: 'يجب أن يكون الاستعلام أطول من 3 أحرف',
    search: 'بحث',
    noAssignmentAvailable: 'لا توجد مهام متاحة!',
    priority: {
        HIGH: 'عالي',
        MEDIUM: 'متوسط',
        LOW: 'منخفض'
    },
    status: {
        PENDING: 'قيد الانتظار',
        APPROVED: 'موافق عليه',
        REJECTED: 'مرفوض',
        FULFILLED: 'مُنفذ',
        CANCELLED: 'ملغى',
        COMPLETED: 'مكتمل',
        ONGOING: 'جاري العمل عليه'
    },
    editAssignment: {
        taskName: 'اسم المهمة',
        dueDate: 'تاريخ الاستحقاق',
        status: 'الحالة',
        priority: 'الأولوية',
        assignedToDepartment: 'مُسندة إلى القسم',
        createdByDepartment: 'أنشئت بواسطة القسم',
        notes: 'ملاحظات',
        updateButton: 'تحديث المهمة',
        updatingButton: 'جاري التحديث...',
        statusOptions: {
            REJECTED: 'مرفوض',
            COMPLETED: 'مكتمل',
            ONGOING: 'جاري العمل عليه'
        },
        priorityOptions: {
            HIGH: 'عالي',
            MEDIUM: 'متوسط',
            LOW: 'منخفض'
        },
        // Assuming there might be messages shown to the user
        messages: {
            updateSuccess: 'تم تحديث المهمة بنجاح',
            updateError: 'خطأ في تحديث المهمة'
        }
    }
};

export default locale;