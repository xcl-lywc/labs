import Vue from 'vue'
import Router from 'vue-router'

//dashboard
const Dashboard = () => import('./views/Dashboard.vue')
//登录
const Login = () => import('./views/Login.vue')
//课程管理
const LessonManageIndex       = () => import("./views/lessonManage/Index.vue");
const LessonList              = () => import("./views/lessonManage/LessonList.vue");
const LessonListDetail        = () => import("./views/lessonManage/LessonListDetail.vue");
const TestList                = () => import("./views/lessonManage/TestList.vue");
const TestDetail              = () => import("./views/lessonManage/TestDetail.vue"); 
const TestGroupStudentResister     = () => import("./views/lessonManage/TestGroupStudentResister.vue");
const TestPersonalStudentResister     = () => import("./views/lessonManage/TestPersonalStudentResister.vue");
const StudentRegister         = () => import("./views/lessonManage/StudentRegister.vue");
const ScoreResult             = () => import("./views/lessonManage/ScoreResult.vue");
const TestPaper               = () => import("./views/lessonManage/TestPaper.vue");
const ExerciseRequest         = () => import("./views/lessonManage/exercise/ExerciseRequest.vue");
const ExercisesTaskDetail     = () => import("./views/lessonManage/exercise/ExercisesTaskDetail.vue"); 
const ExerciseQuestionDetail  = () => import("./views/lessonManage/exercise/ExerciseQuestionDetail.vue");
const MarkingScore            = () => import("./views/lessonManage/exercise/MarkingScore.vue");
const BookingClassroom        = () => import("./views/lessonManage/exercise/BookingClassroom.vue");
const ScheduleOfAchievements  = () => import("./views/lessonManage/exercise/ScheduleOfAchievements.vue");
const ReportDetail            = () => import("./views/lessonManage/report/ReportDetail.vue");
const CreateQuestionnaire     = () => import("./views/lessonManage/evaluate/CreateQuestionnaire.vue");
const QuestionnaireTaskDetail = () => import("./views/lessonManage/evaluate/QuestionnaireTaskDetail.vue");
const QuestionnaireCheck      = () => import("./views/lessonManage/evaluate/QuestionnaireCheck.vue");
const QuestionnaireScore      = () => import("./views/lessonManage/evaluate/QuestionnaireScore.vue");
const AttendanceTaskDetail    = () => import("./views/lessonManage/attendance/AttendanceTaskDetail.vue");
const AttendanceSheet         = () => import("./views/lessonManage/AttendanceSheet.vue");
const CourseCount             = () => import("./views/lessonManage/CourseCount.vue");
const ClassOccupy              = () => import("./views/lessonManage/ClassOccupy.vue");
const LessonSystem                              = () => import("./views/lessonManage/LessonSystem.vue");
const LessonSystemCourseDetail                  = () => import("./views/lessonManage/lessonSystemDetail/LessonSystemCourseDetail.vue");
const LessonSystemQuestionnaireDetail           = () => import("./views/lessonManage/lessonSystemDetail/questionnaire/LessonSystemQuestionnaireDetail.vue");
const LessonSystemExperimentDetail              = () => import("./views/lessonManage/lessonSystemDetail/experiment/LessonSystemExperimentDetail.vue");
const LessonSystemReportDetail                  = () => import("./views/lessonManage/lessonSystemDetail/experiment/task/LessonSystemReportDetail.vue");
const LessonSystemAnswerDetail                  = () => import("./views/lessonManage/lessonSystemDetail/experiment/task/LessonSystemAnswerDetail.vue");
const LessonSystemQuestionDetail                = () => import("./views/lessonManage/lessonSystemDetail/experiment/task/LessonSystemQuestionDetail.vue");

const LessonCreateQuestionnaire                 = () => import("./views/lessonManage/lesson/CreateQuestionnaire.vue");
const LessonQuestionnaireDetail                 = () => import("./views/lessonManage/lesson/QuestionnaireDetail.vue");
const LessonQuestionnaireCheck                  = () => import("./views/lessonManage/lesson/QuestionnaireCheck.vue");
const LessonQuestionnaireScore                  = () => import("./views/lessonManage/lesson/QuestionnaireScore.vue");  



//设备管理
const DeviceManageIndex = () => import("./views/deviceManage/Index.vue");
const Standard          = () => import("./views/deviceManage/Standard.vue");
const DeviceList        = () => import("./views/deviceManage/DeviceList.vue");
const Rent              = () => import("./views/deviceManage/Rent.vue");
const Repair            = () => import("./views/deviceManage/Repair.vue");
const Scrap             = () => import("./views/deviceManage/Scrap.vue");
const WorkList          = () => import("./views/deviceManage/WorkList.vue");
const MyDevice              = () => import("./views/deviceManage/MyDevice.vue");

//设备耗材管理
const ConsumablesManageIndex = () => import("./views/consumablesManage/Index.vue");
const Consume          = () => import("./views/consumablesManage/Consume.vue");
const Warehouse          = () => import("./views/consumablesManage/Warehouse.vue");
const Record          = () => import("./views/consumablesManage/Record.vue");
const InstockDetailedForm          = () => import("./views/consumablesManage/InstockDetailedForm.vue");
const Out          = () => import("./views/consumablesManage/Out.vue");
const OutstockDetailedForm          = () => import("./views/consumablesManage/OutstockDetailedForm.vue");
const MyOut          = () => import("./views/consumablesManage/MyOut.vue");
const InstockDetail          = () => import("./views/consumablesManage/InstockDetail.vue");
const OutstockDetail          = () => import("./views/consumablesManage/OutstockDetail.vue");

//人员管理
const PersonManageIndex = () => import("./views/personManage/Index.vue");
const UserList          = () => import("./views/personManage/UserList.vue");
const RoleList          = () => import("./views/personManage/RoleList.vue");
const Authority         = () => import("./views/personManage/Authority.vue");
const Faculty           = () => import("./views/personManage/Faculty.vue");
const Empower           = () => import("./views/personManage/Empower.vue");

//日志管理
const LogManageIndex = () => import("./views/logManage/Index.vue");
const User           = () => import("./views/logManage/User.vue");
const System         = () => import("./views/logManage/System.vue");
const Security       = () => import("./views/logManage/Security.vue");

//实验室管理
const LabManageIndex  = () => import("./views/labManage/Index.vue");
const LabList         = () => import("./views/labManage/LabList.vue");
const ClassroomList   = () => import("./views/labManage/ClassroomList.vue");
const ClassroomDetail = () => import("./views/labManage/ClassroomDetail.vue");

//设置
const SettingsIndex  = () => import("./views/settings/Index.vue");
const ArticleSetting = () => import("./views/settings/ArticleSetting.vue");
const HomeSetting    = () => import("./views/settings/HomeSetting.vue");
const SchoolYear        = () => import("./views/settings/SchoolYear.vue");

//实验管理
const EptManageIndex      = () => import("./views/eptManage/Index.vue");
const ReportTaskList      = () => import("./views/eptManage/ReportTaskList.vue");
const ReportTaskDetail    = () => import("./views/eptManage/ReportTaskDetail.vue");
const ExerciseScore       = () => import("./views/eptManage/ExerciseScore.vue");
const ExerciseScoreDetail = () => import("./views/eptManage/ExerciseScoreDetail.vue");
const ExerciseTestPaper   = () => import("./views/eptManage/ExerciseTestPaper.vue");
const ExperimentalExercises   = () => import("./views/eptManage/ExperimentalExercises.vue");
const ReportScore   = () => import("./views/eptManage/ReportScore.vue");
const ReportScoreDetail   = () => import("./views/eptManage/ReportScoreDetail.vue");
const EPTMarkingScore   = () => import("./views/eptManage/MarkingScore.vue");
const ExperimentalQuestionnaire   = () => import("./views/eptManage/ExperimentalQuestionnaire.vue");

//维护系统
const MaintenanceSystemIndex  = () => import("./views/maintenanceSystem/Index.vue");
const FeedbackPage            = () => import("./views/maintenanceSystem/Feedback.vue");
const InstructionsPage        = () => import("./views/maintenanceSystem/Instructions.vue");

Vue.use(Router)

export default new Router({
  mode: "history",
  base: "/web/",
  routes: [
    //设置默认进入页面
    {
      path: '*',
      redirect: '/login', 
    },
    {
      path: '/maintenance',
      name: 'MaintenanceSystemIndex',
      component: MaintenanceSystemIndex,
      navName: '维护系统',
      meta: {
        showNav: false
      },
      children: [
        {path: "feedback", name: "FeedbackPage", navName: '反馈', component: FeedbackPage, meta: { showNav: true }},
        {path: "instructions", name: "InstructionsPage", navName: '说明书', component: InstructionsPage, meta: { showNav: true }},
      ],
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        showNav: false //是否显示导航
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        showNav: false
      }
    },
    {
      path: '/lesson',
      name: 'LessonManageIndex',
      component: LessonManageIndex,
      navName: '课程管理',
      meta: {
        showNav: true
      },
      children: [
        { path: "list", 
          name: "LessonListIndex", 
          navName: '课程', 
          component: LessonManageIndex, 
          meta: { showNav: true },
          children: [
            {path: "", name: "LessonList", navName: '课程', component: LessonList, meta: { showNav: true },},
            {path: "detail/:id", name: "LessonListDetail", navName: '课程-详情', component: LessonListDetail, meta: { showNav: true }},
            {path: "studentregister/:id", name: "StudentRegister", navName: '学生花名册', component: StudentRegister, meta: { showNav: true }},
            {path: "scoreresult/:member_id/:course_id", name: "ScoreResult", navName: '学生成绩单', component: ScoreResult, meta: { showNav: true }},
            {path: "classoccupy", name: "ClassOccupy", navName: '教室占用', component: ClassOccupy, meta: { showNav: true },},
            {path: "createquestionnaire/:course_id", name: "LessonCreateQuestionnaire", navName: '添加课程问卷', component: LessonCreateQuestionnaire, meta: { showNav: true }},
            {path: "questionnairedetail/:course_id/:cquestionnaire_id/:questionnaire_id", name: "LessonQuestionnaireDetail", navName: '课程问卷详情', component: LessonQuestionnaireDetail, meta: { showNav: true }},
            {path: "questionnairecheck/:course_id/:cquestionnaire_id/:questionnaire_id", name: "LessonQuestionnaireCheck", navName: '查看问卷', component: LessonQuestionnaireCheck, meta: { showNav: true }},
            {path: "questionnairescore/:course_id/:cquestionnaire_id/:questionnaire_id", name: "LessonQuestionnaireScore", navName: '答题', component: LessonQuestionnaireScore, meta: { showNav: true }},
            
          ]
        }, 
        {
          path: "testlist", 
          name: "TestListIndex", 
          navName: '实验', 
          component: LessonManageIndex, 
          meta: { showNav: true },
          children: [
            {path: "", name: "TestList", navName: '实验', component: TestList, meta: { showNav: true }},
            {path: "testdetail/:id", name: "TestDetail", navName: '实验-详情', component: TestDetail, meta: { showNav: true }},
            {path: "bookingclassroom/:experiment_id", name: "BookingClassroom", navName: '预约教室', component: BookingClassroom, meta: { showNav: true }},
            {path: "attendancetaskdetail/:task_id/:experiment_id", name: "AttendanceTaskDetail", navName: '考勤任务详情', component: AttendanceTaskDetail, meta: { showNav: true }},
            {path: "exerciserequest/:id", name: "ExerciseRequest", navName: '习题要求', component: ExerciseRequest, meta: { showNav: true }},
            {path: "createquestionnaire/:id", name: "CreateQuestionnaire", navName: '创建问卷', component: CreateQuestionnaire, meta: { showNav: true }},
            {path: "exercisestaskdetail/:experiment_id/:task_id", name: "ExercisesTaskDetail", navName: '习题任务详情', component: ExercisesTaskDetail, meta: { showNav: true }},
            {path: "attendancesheet/:experiment_id", name: "AttendanceSheet", navName: '考勤表', component: AttendanceSheet, meta: { showNav: true }},
            {path: "questionnairetaskdetail/:id", name: "QuestionnaireTaskDetail", navName: '问卷任务详情', component: QuestionnaireTaskDetail, meta: { showNav: true }},
            {path: "questionnairecheck/:experiment_id/:questionnaire_id/:task_id", name: "QuestionnaireCheck", navName: '问卷详情', component: QuestionnaireCheck, meta: { showNav: true }},
            {path: "questionnairescore/:experiment_id/:questionnaire_id/:task_id", name: "QuestionnaireScore", navName: '填写问卷', component: QuestionnaireScore, meta: { showNav: true }},
            {path: "testpaper/:experiment_id/:task_id/:associated_object", name: "TestPaper", navName: '试卷详情', component: TestPaper, meta: { showNav: true }},
            {path: "reportdetail/:id", name: "ReportDetail", navName: '报告详情', component: ReportDetail, meta: { showNav: true }},
            {path: "exercisequestiondetail/:experiment_id/:task_id/:solution_id:/type", name: "ExerciseQuestionDetail", navName: '习题详情', component: ExerciseQuestionDetail, meta: { showNav: true }},
            {path: "markingscore/:experiment_id/:task_id/:solution_id", name: "MarkingScore", navName: '评分', component: MarkingScore, meta: { showNav: true }},
            {path: "scheduleofachievements/:experiment_id", name: "ScheduleOfAchievements", navName: '成绩明细表', component: ScheduleOfAchievements, meta: { showNav: true }},
            {path: "coursecount", name: "CourseCount", navName: '课程安排', component: CourseCount, meta: { showNav: true }},
            {path: "testgroupstudentresister/:id/:courseId", name: "TestGroupStudentResister", navName: '小组花名册', component: TestGroupStudentResister, meta: { showNav: true }},
            {path: "testpersonalstudentresister/:id/:courseId", name: "TestPersonalStudentResister", navName: '个人花名册', component: TestPersonalStudentResister, meta: { showNav: true }},
          ]
        }, 
        {
          path: "system", 
          name: "LessonSystemIndex", 
          navName: '课程', 
          component: LessonManageIndex, 
          meta: { showNav: true },
          children: [
            {path: "", name: "LessonSystem", navName: '课程体系', component: LessonSystem, meta: { showNav: true },},
            {path: "coursedetail/:course_id", name: "LessonSystemCourseDetail", navName: '课程体系-课程详情', component: LessonSystemCourseDetail, meta: { showNav: true },},
            {path: "questionnairedetail/:course_id/:questionnaire_id", name: "LessonSystemQuestionnaireDetail", navName: '课程体系-课程详情-问卷详情', component: LessonSystemQuestionnaireDetail, meta: { showNav: true },},
            {path: "experimentdetail/:course_id/:experiment_id", name: "LessonSystemExperimentDetail", navName: '课程体系-课程详情-实验详情', component: LessonSystemExperimentDetail, meta: { showNav: true },},
            {path: "reportdetail/:course_id/:experiment_id/:task_id", name: "LessonSystemReportDetail", navName: '课程体系-课程详情-实验详情-报告任务详情', component: LessonSystemReportDetail, meta: { showNav: true },},
            {path: "answerdetail/:course_id/:experiment_id/:task_id", name: "LessonSystemAnswerDetail", navName: '课程体系-课程详情-实验详情-答题任务详情', component: LessonSystemAnswerDetail, meta: { showNav: true },},
            {path: "questiondetail/:course_id/:experiment_id/:task_id", name: "LessonSystemQuestionDetail", navName: '课程体系-课程详情-实验详情-问卷任务详情', component: LessonSystemQuestionDetail, meta: { showNav: true },}
          ]
        }
      ],
    },
    {
      path: '/device',
      name: 'DeviceManageIndex',
      component: DeviceManageIndex,
      navName: '设备管理',
      meta: {
        showNav: true
      },
      children: [
        {path: "standard", name: "Standard", navName: '设备规格', component: Standard, meta: { showNav: true }},
        {path: "list", name: "DeviceList", navName: '实验设备', component: DeviceList, meta: { showNav: true }},
        {path: "repair", name: "Repair", navName: '设备维修', component: Repair, meta: { showNav: true }},
        {path: "scrap", name: "Scrap", navName: '设备报废', component: Scrap, meta: { showNav: true }},
        {path: "rent", name: "Rent", navName: '设备借还', component: Rent, meta: { showNav: true }},
        {path: "worklist", name: "WorkList", navName: '设备工单', component: WorkList, meta: { showNav: true }},
        {path: "mydevice", name: "MyDevice", navName: '我的设备', component: MyDevice, meta: { showNav: true }},
      ]
    },
    {
      path: '/consumables',
      name: 'ConsumablesManageIndex',
      component: ConsumablesManageIndex,
      navName: '耗材管理',
      meta: {
        showNav: true
      },
      children: [
        {path: "consume", name: "Consume", navName: '设备耗材', component: Consume, meta: { showNav: true }},
        {path: "warehouse", name: "Warehouse", navName: '耗材仓库', component: Warehouse, meta: { showNav: true }},
        {path: "record", name: "Record", navName: '入库', component: Record, meta: { showNav: true }},
        {path: "instockdetail/:id", name: "InstockDetail", navName: '入库-详情', component: InstockDetail, meta: { showNav: true }},
        {path: "instockdetailedform/:type/:id", name: "InstockDetailedForm", navName: '入库-入库单', component: InstockDetailedForm, meta: { showNav: true }},//  type为1时创建出库单，为2时编辑出库单，为3时出库操作
        {path: "out", name: "Out", navName: '出库', component: Out, meta: { showNav: true }},
        {path: "myout", name: "MyOut", navName: '我的申请', component: MyOut, meta: { showNav: true }},
        {path: "outstockdetail/:type/:id", name: "OutstockDetail", navName: '出库/我的申请-详情', component: OutstockDetail, meta: { showNav: true }},// type 1为出库详情，2为我的申请详情
        {path: "outstockDetailedform/:page/:type/:id", name: "OutstockDetailedForm", navName: '出库-出库单', component: OutstockDetailedForm, meta: { showNav: true }},//  type为1时创建出库单，为2时编辑出库单，为3时出库操作 //  page为1时出库单，为2时我的出库单
      ]
    },
    {
      path: '/person',
      name: 'PersonManageIndex',
      component: PersonManageIndex,
      navName: '人员管理',
      meta: {
        showNav: true
      },
      children: [
        {path: "userlist", name: "UserList", navName: '用户管理', component: UserList, meta: { showNav: true }},
        {path: "rolelist", name: "RoleList", navName: '角色管理', component: RoleList, meta: { showNav: true }},
        {path: "authority", name: "Authority", navName: '权限管理', component: Authority, meta: { showNav: true }},
        {path: "faculty", name: "Faculty", navName: '院系管理', component: Faculty, meta: { showNav: true }},
        {path: "empower", name: "Empower", navName: '授权管理', component: Empower, meta: { showNav: true }},
      ]
    },
    {
      path: '/lab',
      name: 'LabManageIndex',
      component: LabManageIndex,
      navName: '实验室管理',
      meta: {
        showNav: true
      },
      children: [
        {path: "lablist", name: "LabList", navName: '实验室', component: LabList, meta: { showNav: true }},
        {path: "classroomlist", name: "ClassroomList", navName: '教室', component: ClassroomList, meta: { showNav: true }},
        {path: "classroomdetail/:id", name: "ClassroomDetail", navName: '教室-详情', component: ClassroomDetail, meta: { showNav: true }},
      ]
    },
    {
      path: '/log',
      name: 'LogManageIndex',
      component: LogManageIndex,
      navName: '日志管理',
      meta: {
        showNav: true
      },
      children: [
        {path: "user", name: "User", navName: '用户日志', component: User, meta: { showNav: true }},
        {path: "system", name: "System", navName: '系统日志', component: System, meta: { showNav: true }},
        {path: "security", name: "Security", navName: '安全日志', component: Security, meta: { showNav: true }},
      ]
    },
    {
      path: '/eptmanage',
      name: 'EptManageIndex',
      component: EptManageIndex,
      navName: '实验管理',
      meta: {
        showNav: true
      },
      children: [
        {path: "reporttasklist", name: "ReportTaskList", navName: '学生报告任务表', component: ReportTaskList, meta: { showNav: true }},
        {path: "reporttaskdetail/:id/:experiment_id", name: "ReportTaskDetail", navName: '学生报告详情', component: ReportTaskDetail, meta: { showNav: true }},
        {path: "exercisescore", name: "ExerciseScore", navName: '习题评分', component: ExerciseScore, meta: { showNav: true }},
        {path: "exercisescoredetail/:task_id/:experiment_id", name: "ExerciseScoreDetail", navName: '习题评分详情', component: ExerciseScoreDetail, meta: { showNav: true }},
        {path: "exercisetestpaper/:report_id/:experiment_id/:associated_object", name: "ExerciseTestPaper", navName: '问卷详情', component: ExerciseTestPaper, meta: { showNav: true }},
        {path: "experimentalexercises", name: "ExperimentalExercises", navName: '问卷详情', component: ExperimentalExercises, meta: { showNav: true }},
        {path: "reportscore", name: "ReportScore", navName: '报告评分', component: ReportScore, meta: { showNav: true }},
        {path: "reportscoredetail/:id/:experiment_id", name: "ReportScoreDetail", navName: '报告评价详情', component: ReportScoreDetail, meta: { showNav: true }},
        {path: "eptmarkingscore/:solution_id/", name: "EPTMarkingScore", navName: '评分', component: EPTMarkingScore, meta: { showNav: true }},
        {path: "experimentalquestionnaire", name: "ExperimentalQuestionnaire", navName: '实验问卷调查', component: ExperimentalQuestionnaire, meta: { showNav: true }},
      ]
    },
    {
      path: '/settings',
      name: 'SettingsIndex',
      component: SettingsIndex,
      navName: '设置',
      meta: {
        showNav: true
      },
      children: [
        {path: "articlesetting", name: "ArticleSetting", navName: '文章设置', component: ArticleSetting, meta: { showNav: true }},
        {path: "homesetting", name: "HomeSetting", navName: '门户页面', component: HomeSetting, meta: { showNav: true }},
        {path: "schoolyear", name: "SchoolYear", navName: '学年学期', component: SchoolYear, meta: { showNav: true }},
      ]
    },
  ]
})
