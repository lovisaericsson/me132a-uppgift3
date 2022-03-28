'use strict'
function DOMFilter (data) {
  let { baseArray, filterKey, filterLabelKey } = data
  let container = document.querySelector('filter')

  // FILTER LOWERCASE AND UPPERCASE LETTERS
  let input = document.querySelector('input')
  input.addEventListener('keyup', function () {
    filterLabelKey = this.value
    filterLabelKey = filterLabelKey.toLowerCase()
    clear()
    let filteredArray = baseArray.courses.filter(obj =>
      obj[filterKey].toLowerCase().includes(filterLabelKey)
    )
    if (filterLabelKey) data.DOMCreator(filteredArray)
  })

  return container
}

// AFTER THE USER HAS SEARCHED IT IN THE SEARCH BOX, IT WILL BECOMES EMPTY
function clear () {
  document.querySelector('.listContainer').innerHTML = ''
}

// ADD ELEMENTS IN MAIN
const main = document.querySelector('main')

let data = {
  baseArray: DATABASE,
  filterKey: 'title',
  filterLabelName: 'Search Courses By Title',
  filterLabelKey: '',
  DOMCreator (array) {
    array.sort((a, b) => a.title.toLowerCase() > b.title.toLowerCase())
    array.forEach(course => {
      document.querySelector('.listContainer').append(DOMCourse(course))
    })
  }
}
main.prepend(DOMFilter(data))

function DOMCourse (course) {
  let container = document.createElement('div')
  container.classList.add('course')

  // ADD TITLE
  container.append(courseTitle(course, container))

  // ADD STAFF
  container.append(courseStaff(course))

  // ADD STUDENTS
  container.append(courseStudents(course))

  return container

  // EVENT ON THE COLLAPSIBLE BUTTON

  function courseTitle (course, containercourse) {
    let container = document.createElement('div')
    let courseTitle = document.createElement('button')
    courseTitle.classList.add('collapsible')
    courseTitle.textContent = course.title
    courseTitle.addEventListener('click', function () {
      let resp = containercourse.getElementsByClassName('resp')
      let staff = containercourse.getElementsByClassName('staff')
      let courses = containercourse.getElementsByClassName('students')
      if (courses[0].style.display == 'block') {
        courses[0].style.display = 'none'
        resp[0].style.display = 'none'
        staff[0].style.display = 'none'
      } else {
        courses[0].style.display = 'block'
        resp[0].style.display = 'block'
        staff[0].style.display = 'block'
      }
    })

    container.appendChild(courseTitle)
    return container
  }

  function courseStaff (course) {
    let container = document.createElement('div')

    // CREATING RESPONSIBLE TITLE AND NAME
    let respEl = document.createElement('div')
    respEl.classList.add('resp')

    let respTitle = document.createElement('h3')
    respTitle.textContent = 'Course Ressponsible:'

    //let respID = DATABASE.teachers.find( teacher => teacher.teacherId == course.courseResponsible).teacherId;

    let resp = DATABASE.teachers.find(
      teacher => teacher.teacherId == course.courseResponsible
    ).teacherId
    let respID = [resp]

    respEl.appendChild(respTitle)

    respEl.appendChild(DOMTeacher(respID))

    container.appendChild(respEl)

    // CREATING REST OF STAFF

    let staffEl = document.createElement('div')
    staffEl.classList.add('staff')

    let staffTitle = document.createElement('h3')
    staffTitle.textContent = 'Teachers:'
    staffEl.appendChild(staffTitle)

    let teacherEl = document.createElement('div')
    teacherEl.appendChild(DOMTeacher(course.teachers))

    staffEl.appendChild(teacherEl)

    container.appendChild(staffEl)

    return container
  }

  function courseStudents (course) {
    // FIND ALL THE STUDENTS THAT HAVE STUDIED THIS COURSE
    let students = DATABASE.students.filter(student =>
      student.courses.find(c => c.courseID == course.courseID)
    )
    let studentArray = students.map(student => {
      let specCourse = student.courses.find(c => c.courseID == course.courseID)

      const container = {}

      container.firstName = student.firstName
      container.lastName = student.lastName
      container.passedCredits = specCourse.passedCredits
      container.semester = specCourse.started.semester
      container.year = specCourse.started.year

      return container
    })

    // SORT THE STUDENTS ASCENDING BY STARTED.YEAR
    studentArray.sort((a, b) => a.year - b.year)

    // DOM-ELEMENTS
    let containerStudents = document.createElement('div')
    containerStudents.classList.add('students')
    container.append(containerStudents)

    containerStudents.innerHTML = `
            <h3>Students:</h3>
            <div class="list"></div>
        `

    studentArray.forEach(student => {
      let containerStudent = document.createElement('div')
      containerStudent.classList.add('student')

      let studentNameCred = document.createElement('span')
      studentNameCred.textContent = `${student.firstName} ${student.lastName} (${student.passedCredits} credits)`
      containerStudent.appendChild(studentNameCred)

      let courseInfo = document.createElement('span')
      courseInfo.textContent = `${student.semester} ${student.year}`
      containerStudent.appendChild(courseInfo)

      if (student.passedCredits == course.totalCredits) {
        containerStudent.style.backgroundColor = '#009879'
        containerStudent.style.color = 'white'
      }

      containerStudents.querySelector('.list').append(containerStudent)
    })

    return containerStudents
  }
}

// BECAUSE YOU NEED TO CREATE TEACHERS IN TWO DIFFRENT PLACES (UNDER THE COURSE RESPONSIVE AND UNDER THE TEACHERS)
// THEN IT IS REASONABLE TO CREATE A FUNCTION THAT RECEIVES INFO ABOUT THE TEACHERS AND RETURNS A DOM-ELEMENT
// THAT CAN BE APPENDED IN THE RIGHT PLACE
function DOMTeacher (teacherID) {
  let container = document.createElement('div')

  teacherID.forEach(id => {
    let staff = document.createElement('span')
    let firstName = DATABASE.teachers.find(teacher => teacher.teacherId == id)
      .firstName
    let lastName = DATABASE.teachers.find(teacher => teacher.teacherId == id)
      .lastName
    let post = DATABASE.teachers.find(teacher => teacher.teacherId == id).post
    staff.textContent = `${firstName} ${lastName} (${post})`

    container.appendChild(staff)
  })

  return container
}
