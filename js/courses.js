"use strict";
function DOMFilter(data){
    
    let {baseArray, filterKey, filterLabelKey} = data;  
    let container = document.querySelector("filter"); 

// Event Keyup on input
    let input = document.querySelector("input");
    input.addEventListener("keyup", function(){
        filterLabelKey = this.value;
        filterLabelKey = filterLabelKey.toLowerCase();
        clear();
        let filteredArray = baseArray.courses.filter( obj => obj[filterKey].toLowerCase().includes(filterLabelKey) );
        if(filterLabelKey) data.DOMCreator(filteredArray);
    });

    return container;    
}

function clear() {
   document.querySelector(".listContainer").innerHTML = "";
}


// Add specific <head> stuff
// Here's where you add <link> and <title>, specific to this page
// Kolla i commonElements.js jag har laggt till en egen grejs där som anpassar css utifrån vilken sida den är på
// för att undvika koddublicering.

// Add Elements in main
const main = document.querySelector("main");

let data = {
    baseArray: DATABASE,
    filterKey: "title",
    filterLabelName: "Search Courses By Title",
    filterLabelKey: "",
    DOMCreator(array) {
        array.sort( (a, b) => a.title.toLowerCase() > b.title.toLowerCase() );
        array.forEach(course => {
            document.querySelector(".listContainer").append(DOMCourse(course));
        })
    }
};
main.prepend(DOMFilter(data));

function DOMCourse(course){

    let container = document.createElement("div");
    container.classList.add("course");

    // We add information through functions to make the code more readable.
    // In order to organise the code we declare the functions 
    // inside DOMCourse, since they will only be called from inside DOMCourse.

    // Add Title
    container.append(courseTitle(course));

    // Add Staff
    container.append(courseStaff(course));

    // Add Students
    container.append(courseStudents(course));
    
    return container;

    // We can put these declarations after the return because they are function declarations,
    // not "normal" executable code. "Normal" executable code is not executed
    // if it is placed after a return instruction.

    function courseTitle(course){    
        let container = document.createElement("div");
        container.textContent = course.title;

        return container;
    }



    function courseStaff(course){
        let container = document.createElement("div");

        // CREATING RESPONSIBLE TITLE AND NAME
        let respEl = document.createElement("div");
        respEl.classList.add("resp");
        
        let respTitle = document.createElement("h3");
        respTitle.textContent = "Course Ressponsible:";

      
        //let respID = DATABASE.teachers.find( teacher => teacher.teacherId == course.courseResponsible).teacherId;
        
        
        let resp = DATABASE.teachers.find( teacher => teacher.teacherId == course.courseResponsible).teacherId;
        let respID = [resp];

        respEl.appendChild(respTitle);

        respEl.appendChild( DOMTeacher( respID ) );

        container.appendChild(respEl);


        // CREATING REST OF STAFF

        let staffEl = document.createElement("div");
        staffEl.classList.add("staff");

        let staffTitle = document.createElement("h3");
        staffTitle.textContent = "Teachers:";
        staffEl.appendChild(staffTitle);

        let teacherEl = document.createElement("div");
        teacherEl.appendChild( DOMTeacher( course.teachers ) );

        staffEl.appendChild(teacherEl);

        container.appendChild(staffEl);

        return container;
    }



    function courseStudents(course){

        // First find all the students that have studied this course
        let students = DATABASE.students.filter( student => student.courses.find( c => c.courseID == course.courseID ) );

        // Then use the array of students that have studied the course to create 
        // another array where each element is an object with the keys:
        // {firstName, lastName, passedCredits (in this course), started: {year, semester} (this course) }
        let studentArray = students.map(student => {

            let specCourse = student.courses.find( c => c.courseID == course.courseID );

            const container = {};

            container.firstName = student.firstName;
            container.lastName = student.lastName;
            container.passedCredits = specCourse.passedCredits;
            container.semester = specCourse.started.semester;
            container.year = specCourse.started.year;
            
            return container;

        });

        // Then sort the students ascending by started.year
        studentArray.sort( (a, b) => a.year - b.year );
    
        // Now do the DOM stuff
        let containerStudents = document.createElement("div");
        containerStudents.classList.add("students");
        container.append(containerStudents);

        containerStudents.innerHTML = `
            <div>Students:</div>
            <div class="list"></div>
        `;

        studentArray.forEach(student => {
            let containerStudent = document.createElement("div");
            containerStudent.classList.add("student");
            
            let studentNameCred = document.createElement("span");
            studentNameCred.textContent = `${ student.firstName } ${ student.lastName } (${ student.passedCredits } credits)`;
            containerStudent.appendChild(studentNameCred);
            
            let courseInfo = document.createElement("span");
            courseInfo.textContent = `${ student.semester } ${ student.year }`;
            containerStudent.appendChild( courseInfo );

            if( student.passedCredits == course.totalCredits ) {
                containerStudent.style.backgroundColor = "#009879";
                containerStudent.style.color = "white";
            }

            containerStudents.querySelector(".list").append(containerStudent);
        });
        
        return containerStudents;
    };

}

// Eftersom du behöver skapa Teachers i två olika platser (under Course Responsible ochunder Teachers)
// så är det enda rimliga att skapa en funktion som tar emot info om läraren och returnerar
// ett DOM-element som kan appendas på rätt ställe.
function DOMTeacher( teacherID ){ 
    let container = document.createElement("div");        

    teacherID.forEach( id => {
        let staff = document.createElement("span");
        let firstName = DATABASE.teachers.find( teacher => teacher.teacherId == id ).firstName;
        let lastName = DATABASE.teachers.find( teacher => teacher.teacherId == id ).lastName;
        let post =DATABASE.teachers.find( teacher => teacher.teacherId == id ).post;
        staff.textContent = `${firstName} ${lastName} (${post})`;

        container.appendChild(staff);
    });

    return container;
    }
    