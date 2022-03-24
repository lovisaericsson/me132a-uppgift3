"use strict"
function DOMFilter(data){
    
    let {baseArray, filterKey, filterLabelKey} = data;  
    let container = document.querySelector("filter"); 

// Event Keyup on input
    let input = document.querySelector("input");
    input.addEventListener("keyup", function(){
        filterLabelKey = this.value;
        filterLabelKey = filterLabelKey.toLowerCase();
        clear();
        let filteredArray = baseArray.students.filter( obj => obj[filterKey].toLowerCase().includes(filterLabelKey) );
        if(filterLabelKey) data.DOMCreator(filteredArray);
    });

    return container;    
}

function clear() {
   document.querySelector(".listContainer").innerHTML = "";
}

// Add Elements in main
const main = document.querySelector("main");

let data = {
    baseArray: DATABASE,
    filterKey: "lastName",
    filterLabelName: "Search Studenst By Last Name",
    filterLabelKey: "",
    DOMCreator(array) {
        let started = "started"; // to access "started" key in courses object
        //Finns en annan funktion man kan använda för sort, istället för den där nere..
        array.sort( (a, b) => a.lastName.toLowerCase() > b.lastName.toLowerCase() );
        array.forEach( arr => arr.courses.sort( (a, b)  => a[started].year - b[started].year || a[started].semester.toLowerCase() < b[started].semester.toLowerCase() ));

        array.forEach( student => {
            student.totalCredits = student.courses.map( course => course.passedCredits).reduce((prev, next) => prev + next);
            document.querySelector(".listContainer").append(DOMStudent(student));
        });
    }
};

main.prepend(DOMFilter(data));

// Här kodar du funktionen som ska skapa DOM-elementet för varje student.
// Se videon för detaljer om vad som ska ingå i elementet.
// DOMStudent:
// 1) Tar emot ett argument som är ett av objekten i STUDENTS
// 2) Returnerar ett DOM-element som placeras i .listContainer (det gör DOMFilter)
function DOMStudent(student){

    let container = document.createElement("div");
    container.classList.add("student");

    // We add information through functions to make the code more readable.
    // In order to organise the code we declare the functions 
    // inside DOMCourse, since they will only be called from inside DOMCourse.

    // Add Name
    container.append(studentName(student.firstName, student.lastName, student.totalCredits));

    // Add Courses
    student.courses.forEach( course => container.append(studentCourses(course)) );

    return container;


    // We can put these declarations after the return because they are function declarations,
    // not "normal" executable code. "Normal" executable code is not executed
    // if it is placed after a return instruction.

    function studentName(firstName, lastName, totalCredits){
        
        let container = document.createElement("div");

        let studentTitle = document.createElement("h2");
        studentTitle.textContent = `${firstName} ${lastName} (total: ${totalCredits} credits)`;

        let courseTitle = document.createElement("h3");
        courseTitle.textContent = "Courses:";

        container.appendChild(studentTitle);
        container.appendChild(courseTitle);
        
        return container;
    }
// Gå igenom alla kursernas titlar. Först skriva alla kurserna, sedan hittar dom med hjälp av find. 
    function studentCourses(course){
        let courseName = DATABASE.courses.find( c => c.courseID == course.courseID ).title;
        let courseCredit = DATABASE.courses.find( c => c.courseID == course.courseID ).totalCredits;
        let started = "started"; // to access "started" key in courses object

        let container = document.createElement("div");
        container.classList.add("course");

        let courseTitle = document.createElement("span");
        courseTitle.textContent = courseName;

        container.appendChild(courseTitle);

        let info = document.createElement("span");
        info.textContent = `${course[started].semester} ${course[started].year} ${course.passedCredits} of ${courseCredit}`;
        if ( course.passedCredits == courseCredit ) {
            container.style.backgroundColor = "#009879";
            container.style.color = "white";
        }

        container.appendChild(info);

        return container;
     }
}