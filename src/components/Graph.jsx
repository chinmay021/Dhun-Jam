import { Bar, BarChart, XAxis, YAxis } from "recharts";

function Graph({ data }) {

  return (

    <div className="flex">
      <span className="-mr-10 mt-2 font-sans text-5xl" >&#8377;</span>
      <BarChart width={600} height={400} data={data}>
        <XAxis dataKey="name" tick={{ fill: 'white' }}  axisLine={{ stroke: '#FFFFFF' }}/>
        <YAxis fill="#FFFFFF" tick={null}  axisLine={{ stroke: '#FFFFFF' }}/>
        <Bar dataKey="value" barSize={30} fill="#F0C3F1"/>
      </BarChart>
    </div>
  );
}

export default Graph;
