import Applicant from "@/assets/images/onboarding/applicant.svg";
import ApplicantSelected from "@/assets/images/onboarding/applicant-selected.svg";
import Designer from "@/assets/images/onboarding/designer.svg";
import DesignerSelected from "@/assets/images/onboarding/designer-selected.svg";
import Developer from "@/assets/images/onboarding/developer.svg";
import DeveloperSelected from "@/assets/images/onboarding/developer-selected.svg";
import Employee from "@/assets/images/onboarding/employee.svg";
import EmployeeSelected from "@/assets/images/onboarding/employee-selected.svg";
import Planner from "@/assets/images/onboarding/planner.svg";
import PlannerSelected from "@/assets/images/onboarding/planner-selected.svg";
import Student from "@/assets/images/onboarding/student.svg";
import StudentSelected from "@/assets/images/onboarding/student-selected.svg";

export const JOB_OPTIONS = [
  {
    value: "디자이너",
    label: "디자이너",
    icon: <Designer />,
    selectedIcon: <DesignerSelected />,
  },
  {
    value: "기획자",
    label: "기획자",
    icon: <Planner />,
    selectedIcon: <PlannerSelected />,
  },
  {
    value: "개발자",
    label: "개발자",
    icon: <Developer />,
    selectedIcon: <DeveloperSelected />,
  },
];

export const STATUS_OPTIONS = [
  {
    value: "재학 중",
    label: "재학중",
    icon: <Student />,
    selectedIcon: <StudentSelected />,
  },
  {
    value: "취업 준비중",
    label: "취업 준비중",
    icon: <Applicant />,
    selectedIcon: <ApplicantSelected />,
  },
  {
    value: "재직 중",
    label: "재직중",
    icon: <Employee />,
    selectedIcon: <EmployeeSelected />,
  },
];
