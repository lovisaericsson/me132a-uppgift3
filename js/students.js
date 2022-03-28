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
    let filteredArray = baseArray.students.filter(obj =>
      obj[filterKey].toLowerCase().includes(filterLabelKey)
    )
    if (filterLabelKey) data.DOMCreator(filteredArray)
  })

  return container
}

// AFTER THE USER HAS SEARCHED AND SEARCH AGAIN, SEARCH RESULT WILL BECOMES EMPTY
function clear () {
  document.querySelector('.listContainer').innerHTML = ''
}

// ADD ELEMENTS IN MAIN
const main = document.querySelector('main')

let data = {
  baseArray: DATABASE,
  filterKey: 'lastName',
  filterLabelName: 'Search Studenst By Last Name',
  filterLabelKey: '',
  DOMCreator (array) {
    let started = 'started' // TO ACCESS "STARTED" KEY IN COURSES OBJECT
    array.sort((a, b) => a.lastName.toLowerCase() > b.lastName.toLowerCase())
    array.forEach(arr =>
      arr.courses.sort(
        (a, b) =>
          a[started].year - b[started].year ||
          a[started].semester.toLowerCase() < b[started].semester.toLowerCase()
      )
    )
    // ADD RESULT STUDENTS IN MAIN
    array.forEach(student => {
      student.totalCredits = student.courses
        .map(course => course.passedCredits)
        .reduce((prev, next) => prev + next)
      document.querySelector('.listContainer').append(DOMStudent(student))
    })
  }
}

main.prepend(DOMFilter(data))

// THE FUNCTION THAT WILL CREATE DOM ELEMENTS FOR EACH STUDENTS
function DOMStudent (student) {
  let container = document.createElement('div')
  container.classList.add('student')
  // ADD NAME
  container.append(
    studentName(
      student.firstName,
      student.lastName,
      student.totalCredits,
      container
    )
  )
  // ADD COURSES FOR THE STUDENT
  student.courses.forEach(course => container.append(studentCourses(course)))

  return container

  // CREATE STUDENT NAME
  function studentName (firstName, lastName, totalCredits, student) {
    let container = document.createElement('div')
    let studentTitle = document.createElement('button')
    studentTitle.classList.add('collapsible')
    // EVENT ON THE COLLAPSIBLE BUTTON
    studentTitle.addEventListener('click', function () {
      if (courseTitle.style.display == 'block') {
        courseTitle.style.display = 'none'
      } else {
        courseTitle.style.display = 'block'
      }
      let courselist = student.getElementsByClassName('course')
      for (let i = 0; i < courselist.length; i++) {
        if (courselist[i].style.display == 'block') {
          courselist[i].style.display = 'none'
        } else {
          courselist[i].style.display = 'block'
        }
      }
    })

    studentTitle.textContent = `${firstName} ${lastName} (total: ${totalCredits} credits)`

    let courseTitle = document.createElement('h3')
    courseTitle.classList.add('Courses')
    courseTitle.textContent = 'Courses:'

    container.appendChild(studentTitle)
    container.appendChild(courseTitle)

    return container
  }
  // CREATE COURSE TITLES
  function studentCourses (course) {
    let courseName = DATABASE.courses.find(c => c.courseId == course.courseId)
      .title
    let courseCredit = DATABASE.courses.find(c => c.courseId == course.courseId)
      .totalCredits
    let started = 'started'

    let container = document.createElement('div')
    container.classList.add('course')

    let courseTitle = document.createElement('span')
    courseTitle.textContent = courseName

    container.appendChild(courseTitle)

    let info = document.createElement('span')
    info.textContent = `${course[started].semester} ${course[started].year} ${course.passedCredits} of ${courseCredit}`
    if (course.passedCredits == courseCredit) {
      container.style.backgroundColor = '#009879'
      container.style.color = 'white'
    }

    container.appendChild(info)

    return container
  }
}
