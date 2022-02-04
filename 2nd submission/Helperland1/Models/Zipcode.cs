using System;
using System.Collections.Generic;

#nullable disable

namespace Helperland1.Models
{
    public partial class Zipcode
    {
        public int Id { get; set; }
        public string ZipcodeValue { get; set; }
        public int CityId { get; set; }

        public virtual City City { get; set; }
    }
}
