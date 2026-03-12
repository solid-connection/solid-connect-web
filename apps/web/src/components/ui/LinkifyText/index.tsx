import Linkify from "linkify-react";

const options = { target: "_blank", className: "text-primary underline" };

const LinkifyText = ({ children }: { children: string }) => <Linkify options={options}>{children}</Linkify>;

export default LinkifyText;
