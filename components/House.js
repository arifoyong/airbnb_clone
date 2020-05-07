import Link from "next/link";

const House = (props) => (
  <div>
    <Link href="/houses/[id]" as={"/houses/" + props.id}>
      <a>
        <img src={props.picture} width="100%" alt="House picture" />
        <p>
          {props.type} - {props.town}
        </p>
        <p>{props.title} </p>
      </a>
    </Link>
  </div>
);

export default House;
