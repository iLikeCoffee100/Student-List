import {useEffect, useState} from 'react';
import Student from './Student';

const StudentList = ({nameQuery, tagQuery}) => {

  //State Hooks
  const [list, setList] = useState(null);
  const [filtNameList, setFiltNameList] = useState([]);
  const [tagList, setTagList] = useState([]);

  //Effect Hook for State List with no Dependencies
  useEffect(() => {
    const getList = async () => {
      const data = await fetchList();
      const updData = data?.students.map(student => { return {...student, tags: [], fullName: `${student.firstName} ${student.lastName}`}});
      setList({students: updData});
    }
    getList();
  }, []);

  //Adding Tags to Student Profiles
  const createTag = (tagQuery, index) => {
    //Filtering By Tag And Setting The Original List
    const newList = {...list};
    newList.students[index - 1].tags.push(tagQuery);
    setList(newList);
    //Setting The State For The Tag List
    setTagList([...tagList, [parseFloat(index) - 1, tagQuery, list.students[index - 1].fullName] ]);
    console.log('List: ', list);
  }

  console.log('TagList: ', tagList);

  //Search By Name
  const searchName = (nameQuery) => {
    //Filtering By Name And Setting the Original List State
    if (nameQuery.length > 0) {
      const filteredNames = list.students.filter(student => student.fullName.toLowerCase().includes(nameQuery));
      return {students: filteredNames};
    } else {
      return list;
    }
    //Filtering By Name and Setting Name List State
    // setFiltNameList([...filtNameList, ])
  }

  //Search By Tag
  const searchTag = (tagQuery) => {
    if (tagQuery.length > 0) {
      const filteredTag =  list.students.filter(student => student.tags.filter(tag => tag.includes(tagQuery)).length > 0);
      return {students: filteredTag};
    } else {
      return list;
    }
  }

  //API Fetch Call
  const fetchList = async () => {
    try {
      const res = await fetch('https://api.hatchways.io/assessment/students');
      const profiles = await res.json();
      return profiles;
    } catch (error) {
      console.log('COULD NOT LOAD STUDENT PROFILES - ERROR: ', error);
    }
  }

  //Invoking Fillter Functions
  let studentList = list;
  if (nameQuery) {
    studentList = searchName(nameQuery);
  } else if (tagQuery) {
    studentList = searchTag(tagQuery);
  } else if (nameQuery && tagQuery) {
    studentList = searchTag(tagQuery);
  }

  return (
    <section id='list-container'>
      {studentList?.students?.map((child, index) => (
        <Student tagAdd={createTag} studentInfo={child} key={index} studentIndex={index} tags={tagList} />
      ))}
    </section>
  );
}

export default StudentList;