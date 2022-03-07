using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Helperland.ViewModels
{
    public class UpdateUserViewModel
    {
        [Required]
        public string firstname { get; set; }

        [Required]
        public string lastname { get; set; }


        [Required]
        [RegularExpression(@"^([0-9]{10})$", ErrorMessage = "Enter valid Mobile Number!")]
        public string mobile { get; set; }
        /*public DateTime? DateOfBirth { get; set; }*/
    }
}
