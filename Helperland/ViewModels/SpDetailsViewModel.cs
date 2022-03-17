using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace Helperland.ViewModels
{
    public class SpDetailsViewModel
    {
        [JsonPropertyName("FirstName")]
        public string FirstName { get; set; }
        [JsonPropertyName("LastName")]
        public string LastName { get; set; }
        [JsonPropertyName("Email")]
        public string Email { get; set; }
        [JsonPropertyName("Mobile")]
        public string Mobile { get; set; }
       /* [JsonPropertyName("Date")]
        public int Date { get; set; }
        [JsonPropertyName("Month")]
        public int Month { get; set; }
        [JsonPropertyName("Year")]
        public int Year { get; set; }
        [JsonPropertyName("Nationality")]
        public int Nationality { get; set; }*/
        [JsonPropertyName("Gender")]
        public int Gender { get; set; }
        [JsonPropertyName("SPProfilePicture")]
        public string SPProfilePicture { get; set; }
        [JsonPropertyName("AddressLine1")]
        public string AddressLine1 { get; set; }
        [JsonPropertyName("AddressLine2")]
        public string AddressLine2 { get; set; }
        [JsonPropertyName("City")]
        public string City { get; set; }
        [JsonPropertyName("State")]
        public string State { get; set; }
        [JsonPropertyName("PostalCode")]
        public string PostalCode { get; set; }
    }
}
