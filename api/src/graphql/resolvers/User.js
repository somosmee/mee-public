const User = {
  role(parent, args, { company }, info) {
    let role = null

    if (company) {
      const member = company.members.find(
        (member) => member.user.toString() === parent._id.toString()
      )
      if (member) role = member.role
    }

    return role
  }
}

export { User as default }
