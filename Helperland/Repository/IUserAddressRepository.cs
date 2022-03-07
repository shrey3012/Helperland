using Helperland.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Helperland.Repository
{
    public interface IUserAddressRepository
    {
        public int AddUserAddress(UserAddress userAddress);
        public UserAddress GetAddressByAddressId(int addressid);
    }
}
