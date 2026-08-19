import { Card, CardHeader } from "../ui/Card";
export function FormSection({ icon, title, subtitle, children, }) {
    return (<Card>
      <CardHeader icon={icon} title={title} subtitle={subtitle}/>
      <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">{children}</div>
    </Card>);
}
