using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Helperland.Models
{
    public class UserAddressViewModel
    {
        [JsonPropertyName("userId")]
        public int userId { get; set; }

        [JsonPropertyName("addressLine1")]
        public string addressLine1 { get; set; }

        [JsonPropertyName("addressLine2")]
        public string addressLine2 { get; set; }

        [JsonPropertyName("city")]
        public string city { get; set; }

        [JsonPropertyName("state")]
        public string state { get; set; }

        [JsonPropertyName("postalCode")]
        public string postalCode { get; set; }

        [JsonPropertyName("isDefault")]
        public bool isDefault { get; set; }

        [JsonPropertyName("isDeleted")]
        public bool isDeleted { get; set; }

        [JsonPropertyName("mobile")]
        public string mobile { get; set; }
    }
}
